var tour = function() {
	return {
		id: "adentro_tour",
		steps: [
			{
				title: i18n.t("tour.navigation_title"),
				content: i18n.t("tour.navigation"),
				target: "#css3menu1>li",
				zindex: 9999,
				placement: "bottom"
			},
			{
				title: i18n.t("tour.player_title"),
				content: i18n.t("tour.player"),
				target: "jp_container_1",
				zindex: 9999,
				placement: "right"
			},
			{
				title: i18n.t("tour.music_title"),
				content: i18n.t("tour.music"),
				target: "#musicLinks>select",
				zindex: 9999,
				placement: "bottom"
			},
			{
				title: i18n.t("tour.schema_title"),
				content: i18n.t("tour.schema"),
				target: "schemaDiv",
				zindex: 9999,
				xOffset: "center",
				yOffset: -50,
				placement: "bottom"
			},
			{
				title: i18n.t("tour.animation_title"),
				content: i18n.t("tour.animation"),
				target: "animationDiv",
				zindex: 9999,
				xOffset: "center",
				placement: "top"
			},
			{
				title: i18n.t("tour.animation_links_title"),
				content: i18n.t("tour.animation_links"),
				target: "#animationLinks>a",
				zindex: 9999,
				xOffset: "center",
				placement: "bottom"
			}
		]
	};
};