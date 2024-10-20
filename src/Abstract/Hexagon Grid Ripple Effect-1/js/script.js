(() => {
	const container = document.getElementById("container");

	const hexagons = container.querySelectorAll(".hexagon");
	const hexagonElements = new Array(...hexagons);

	const ripple = (target) => {
		if (container.classList.contains("show-ripple")) {
			return;
		}
		const targetRect = target.getBoundingClientRect();
		const data = hexagonElements
			.map((element) => {
				const rect = element.getBoundingClientRect();
				const centerX = rect.x + rect.width / 2;
				const centerY = rect.y + rect.height / 2;
				const distance = Math.round(
					Math.sqrt(
						Math.pow(rect.x - targetRect.x, 2) +
						Math.pow(rect.y - targetRect.y, 2)
					)
				);
				return {
					element,
					rect,
					centerX,
					centerY,
					distance
				};
			})
			.sort((a, b) =>
				a.distance > b.distance ? 1 : a.distance < b.distance ? -1 : 0
			);

		const [max] = data.slice(-1);
		data.forEach((item) =>
			item.element.style.setProperty(
				"--ripple-factor",
				`${(item.distance * 100) / max.distance}`
			)
		);
		container.classList.toggle("show-ripple");
		const cleanUp = () => {
			requestAnimationFrame(() => {
				container.classList.remove("show-ripple");
				data.forEach((item) =>
					item.element.style.removeProperty("--ripple-factor")
				);
				max.element.removeEventListener("animationend", cleanUp);
			});
		};
		max.element.addEventListener("animationend", cleanUp);
	};

	hexagons.forEach((hexagon) => {
		hexagon.addEventListener("click", () => {
			ripple(hexagon, hexagons);
		});
	});

	const switchButton = document.getElementById('switch');
	const toggleTheme = () => {
		switchButton.classList.toggle('checked');
		document.documentElement.classList.toggle('vision-ui');
	};
	switchButton.addEventListener('click', toggleTheme);

	// demo
	setTimeout(() => {
		ripple(hexagonElements[0], hexagons);
		setTimeout(() => {
			toggleTheme();
			setTimeout(() => {
				ripple(hexagonElements[0], hexagons);
			}, 600);
		}, 900);
	}, 300);
})();

function SucrosePropertyListener(name, val) {
	switch (name) {
		case "bgImage":
			ChangeBodyBeforeBackgroundImage('./' + val.folder + '/' + val.value.replace(/\\/g, "/"));
			break
		default:
			break
	}
}

function ChangeBodyBeforeBackgroundImage(newImageUrl) {
	const body = document.body;
	const computedStyle = window.getComputedStyle(body, '::before');

	let currentBackgroundImage = computedStyle.backgroundImage;

	const updatedBackgroundImage = currentBackgroundImage.replace(
		/url\([^\)]+\)/,
		`url(${newImageUrl})`
	);

	let styleElement = document.getElementById('dynamic-style');
	if (!styleElement) {
		styleElement = document.createElement('style');
		styleElement.id = 'dynamic-style';
		document.head.appendChild(styleElement);
	}

	styleElement.innerHTML = `
        body:before {
            background-image: ${updatedBackgroundImage};
        }
    `;
}