import * as React from 'react';
import { Router } from '@reach/router';

import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import Footer from '../components/Footer';

const indexPage = () => {
	return (
		<>
			<main>
				<Sidebar />
				<Content />
			</main>
			<footer>
				<Footer />
			</footer>
		</>
	);
};
export default indexPage;
