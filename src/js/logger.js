const measureHub = {};
const measuresCompletions = {};

function end() {
	this.time = performance.now() - this.start;
}

const noop = {
	end: () => {}
};

function getOperationMeasure(name, maxMeasures) {
	if (!measureHub[name]) {
		measureHub[name] = [];
	}
	const measures = measureHub[name];
	if (measures.length >= maxMeasures) {
		if (!measuresCompletions[name]) {
			const sum = measures.reduce((result, measure) => measure.time + result, 0);
			const average = sum / measures.length;
			console.log(`${ name }: ${ sum } / ${ measures.length } = ${ average }`);
			measuresCompletions[name] = true;
		}
		return noop;
	}

	const measure = {
		start: performance.now()
	};
	measure.end = end.bind(measure);
	measures.push(measure);
	return measure;
}

module.exports = {
	getOperationMeasure
};
