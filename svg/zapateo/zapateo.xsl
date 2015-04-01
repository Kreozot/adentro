<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns="http://www.w3.org/2000/svg">

	<xsl:variable name="xMargin" select="10"/>
	<xsl:variable name="schemaWidth" select="500"/>
	<xsl:variable name="height" select="50"/>
	<xsl:variable name="blockHeight" select="20"/>


	<!-- Движение -->
	<xsl:template match="move">
		<!-- Начальная позиция элемента в тактах -->
		<xsl:param name="pos" />
		<!-- Ширина одного такта в пикселях -->
		<xsl:param name="oneTimeWidth" />

		<xsl:variable name="x" select="$xMargin + $pos * $oneTimeWidth"/>
		<xsl:variable name="y" select="1"/>
		<xsl:variable name="blockWidth" select="$oneTimeWidth * @length"/>

 		<rect class="move {@class}" x="{$x}" y="{$y}" width="{$blockWidth}" height="{$blockHeight}" data-visualization="{@visualization}" data-leg="{@leg}" data-length="{@length}"/>
 		<rect class="active-frame" x="{$x + 1}" y="{$y + 2}" width="{$blockWidth - 3}" height="{$blockHeight - 4}" id="frame{@pos}"/>

    	<text class="move-text" x="{$x + ($blockWidth div 2)}" y="{$y + $blockHeight div 2 + 4}"><xsl:copy-of select="./node()" /></text>

 		<!-- Передаём обработчику следующий элемент -->
		<xsl:apply-templates select="./following-sibling::*[1]">
			<xsl:with-param name="pos" select="$pos + @length" />
			<xsl:with-param name="oneTimeWidth" select="$oneTimeWidth" />
		</xsl:apply-templates>
	</xsl:template>

	<!--  -->
	<xsl:template name="scale">
		<!-- Текущая позиция -->
		<xsl:param name="pos" />
		<!-- Количество тактов -->
		<xsl:param name="overallTimes" />
		<!-- Ширина одного такта в пикселях -->
		<xsl:param name="oneTimeWidth" />

		<xsl:variable name="x" select="$xMargin + $pos * $oneTimeWidth"/>
		<xsl:variable name="y" select="$blockHeight"/>	

		<line x1="{$x}" y1="{$y}" x2="{$x}" y2="{$y + 16}"/>

	 	<xsl:if test="$pos &gt; 0">
	    	<text class="scale-text" x="{$x - ($oneTimeWidth div 2)}" y="{$y + 14}"><xsl:value-of select="$pos"/></text>
		</xsl:if>

 		<!-- Вызываем ещё раз для следующей позиции -->
 		<xsl:if test="$pos &lt; $overallTimes">
			<xsl:call-template name="scale">
				<xsl:with-param name="pos" select="$pos + 1" />
				<xsl:with-param name="overallTimes" select="$overallTimes" />
				<xsl:with-param name="oneTimeWidth" select="$oneTimeWidth" />
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template match="zapateo">
		<svg width="{$schemaWidth + ($xMargin * 2)}" height="{$height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<defs>
				<style type="text/css">
					line {
						shape-rendering: crispEdges;
						stroke: black;
					}

					rect {
						shape-rendering: crispEdges;
					}

					.move {
						stroke: black;
						stroke-width: 1px;
						fill-opacity: 0.6;
					}					

					.move.current {
						stroke: red;
						stroke-width: 2px;
					}

					.move-text {
						text-anchor: middle;
						font-family: Geneva, Arial, Helvetica, sans-serif;
						font-size: 8pt;
					}

					.move-text.current {
						font-weight: bold;
					}					

					.scale-text {
						text-anchor: middle;
						font-family: Geneva, Arial, Helvetica, sans-serif;
						font-size: 8pt;
					}

					.taco {
						fill: #3399FF;
					}

					.punta {
						fill: #99FF33;
					}

					.planta {
						fill: #FF3399;
					}

					.quebrada {
						fill: #339933;
					}
				</style>
			</defs>

			<xsl:variable name="overallTimes" select="sum(./move/@length)" />
			<xsl:variable name="oneTimeWidth" select="$schemaWidth div $overallTimes"/>

			<xsl:call-template name="scale">
				<xsl:with-param name="pos" select="0" />
				<xsl:with-param name="overallTimes" select="$overallTimes" />
				<xsl:with-param name="oneTimeWidth" select="$oneTimeWidth" />
			</xsl:call-template>

			<xsl:apply-templates select="./move[1]">
				<xsl:with-param name="pos" select="0" />
				<xsl:with-param name="oneTimeWidth" select="$oneTimeWidth" />
			</xsl:apply-templates>

		</svg>
	</xsl:template>

</xsl:stylesheet>