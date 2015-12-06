<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns="http://www.w3.org/2000/svg">

	<xsl:variable name="xMargin" select="50"/>
	<xsl:variable name="schemaWidth" select="800"/>
	<xsl:variable name="height" select="60"/>
	<xsl:variable name="blockHeight" select="20"/>
	<xsl:variable name="barWidth" select="3"/>

	<!-- Элемент -->
	<xsl:template match="element">
		<!-- Начальная позиция элемента в тактах -->
		<xsl:param name="pos" />
		<!-- Текущая строка -->
		<xsl:param name="line" />
		<!-- Ширина одного такта в пикселях -->
		<xsl:param name="oneTimeWidth" />

		<!-- Смещение элемента после разделителя части -->
		<xsl:variable name="xOffset">
			<xsl:choose>
				<!-- Если до этого был разделитель части -->
		    	<xsl:when test="./preceding-sibling::*[1][self::bar]">
		    		<!-- Устанавливаем отступ, равный его ширине -->
					<xsl:value-of select="$barWidth"/>
		    	</xsl:when>
		    	<xsl:otherwise>
					<xsl:value-of select="0"/>
		    	</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:variable name="x" select="$xMargin + $pos * $oneTimeWidth + $xOffset"/>
		<xsl:variable name="y" select="($line - 1) * $height + 1"/>
		<xsl:variable name="blockWidth" select="$oneTimeWidth * @times - $xOffset"/>

 		<rect class="element {@class}" x="{$x}" y="{$y}" width="{$blockWidth}" height="{$blockHeight}" id="{@id}" onclick="window.top.playElement('{@id}')" data-visualization="{@visualization}" data-manposition="{@manPosition}" data-times="{@times}"/>
 		<rect class="active-frame" x="{$x + 1}" y="{$y + 2}" width="{$blockWidth - 3}" height="{$blockHeight - 4}" id="{@id}-frame"/>

    	<text class="times-count-text" x="{$x + ($blockWidth div 2)}" y="{$y + $blockHeight div 2 + 4}"><xsl:value-of select="@times"/></text>

    	<!-- Отступ по вертикали для подписи -->
		<xsl:variable name="textTop">
			<xsl:choose>
		    	<xsl:when test="not(@yOffset)">
					<xsl:value-of select="$blockHeight + 16"/>
		    	</xsl:when>
		    	<xsl:otherwise>
					<xsl:value-of select="$blockHeight + 32"/>
		    	</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<!-- Смещение по горизонтали для подписи -->
		<xsl:variable name="textOffset">
			<xsl:choose>
		    	<xsl:when test="@textOffset">
					<xsl:value-of select="@textOffset"/>
		    	</xsl:when>
		    	<xsl:otherwise>
					<xsl:value-of select="0"/>
		    	</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:if test="@yOffset">
			<line x1="{$x + ($blockWidth div 2)}" y1="{$y + $blockHeight + 3}" x2="{$x + ($blockWidth div 2)}" y2="{$y + $textTop - 11}" class="text-line"/>
		</xsl:if>
    	<text class="element-text" x="{$x + ($blockWidth div 2) + $textOffset}" y="{$y + $textTop}" id="{@id}-text"><xsl:copy-of select="./node()" /></text>

 		<!-- Передаём обработчику следующий элемент -->
		<xsl:apply-templates select="./following-sibling::*[1]">
			<xsl:with-param name="pos" select="$pos + @times" />
			<xsl:with-param name="line" select="$line" />
			<xsl:with-param name="oneTimeWidth" select="$oneTimeWidth" />
		</xsl:apply-templates>
	</xsl:template>

	<!-- Разделитель -->
	<xsl:template match="bar">
		<!-- Начальная позиция элемента в тактах -->
		<xsl:param name="pos" />
		<!-- Текущая строка -->
		<xsl:param name="line" />
		<!-- Ширина одного такта в пикселях -->
		<xsl:param name="oneTimeWidth" />

		<xsl:variable name="x" select="$xMargin + $pos * $oneTimeWidth + 1"/>
		<xsl:variable name="y" select="($line - 1) * $height + 1"/>

		<line class="bar" x1="{$x}" y1="{$y}" x2="{$x}" y2="{$y + $blockHeight + 1}"/>

		<!-- Передаём обработчику следующий элемент -->
		<xsl:apply-templates select="./following-sibling::*[1]">
			<xsl:with-param name="line" select="$line" />
			<xsl:with-param name="pos" select="$pos" />
			<xsl:with-param name="oneTimeWidth" select="$oneTimeWidth" />
		</xsl:apply-templates>
	</xsl:template>

	<!-- Шаблон части -->
	<xsl:template match="part">
		<xsl:variable name="overallTimes" select="sum(./element/@times)" />
		<xsl:variable name="oneTimeWidth" select="$schemaWidth div $overallTimes"/>

		<xsl:apply-templates select="./element[1]">
			<xsl:with-param name="pos" select="0" />
			<xsl:with-param name="line" select="position()" />
			<xsl:with-param name="oneTimeWidth" select="$oneTimeWidth" />
		</xsl:apply-templates>
	</xsl:template>

	<!-- Схема -->
	<xsl:template match="schema">
		<svg width="{$schemaWidth + ($xMargin * 2)}" height="{$height * count(/schema/part)}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<defs>
				<style type="text/css">
					line {
						shape-rendering: crispEdges;
					}

					rect {
						shape-rendering: crispEdges;
					}

					.text-line {
						stroke: black;
						stroke-width: 1px;
					}

					.element {
						stroke: black;
						stroke-width: 1px;
						fill-opacity: 0.6;
					}

					.element.current {
						stroke: red;
						stroke-width: 2px;
					}

					.element:hover {
						fill-opacity: 1;
						cursor: pointer;
					}

					.active-frame {
						fill-opacity: 0;
						stroke-opacity: 0;
						stroke: red;
						stroke-width: 3px;
						pointer-events: none;
					}
					.active-frame.current {
						stroke-opacity: 1;
					}

					.bar {
						stroke: black;
						stroke-width: 3px;
					}

					.element-text {
						text-anchor: middle;
						font-family: Geneva, Arial, Helvetica, sans-serif;
						font-size: 8pt;
					}

					.element-text.current {
						font-weight: bold;
					}

					.times-count-text {
						text-anchor: middle;
						font-family: Geneva, Arial, Helvetica, sans-serif;
						fill: #2F4F4F;
						font-size: 8pt;
						pointer-events: none;
					}

					.vuelta {
						fill: #75F6E9;
					}

					.coronacion {
						fill: #BD9DFF;
					}

					.arresto {
						fill: #A0F675;
					}

					.zapateo {
						fill: #F6CF75;
					}

					.zarandeo {
						fill: #CCFF33;
					}

					.giro {
						fill: #00EE00;
					}

					.avance {
						fill: #3399FF;
					}

					.esquina {
						fill: #4488ff;
					}

					.regreso {
						fill: #99aaee;
					}
				</style>
			</defs>

			<xsl:apply-templates select="part" />

		</svg>
	</xsl:template>

</xsl:stylesheet>