function SucrosePropertyListener(name, val) {
	switch (name) {
		case "themeMode":
			switch (val.value) {
				case 0:
					//Dark
					changeTheme(0);
					break;
				case 1:
					//Light
					changeTheme(1);
					break;
				default:
					break;
			}
			break;
		default:
			break;
	}
}