# Digital Awareness
Unlearn bad digital habits

Supported Browsers
https://img.shields.io/badge/Google_chrome-4285F4?style=for-the-badge&logo=Google-chrome&logoColor=white

## Development Setup
[![Build Extension](https://github.com/MatthewDlr/Digital-Awareness/actions/workflows/build.yml/badge.svg)](https://github.com/MatthewDlr/Digital-Awareness/actions/workflows/build.yml)

### Tech Stack
https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white
https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white


### Installation
Run `npm install` to install get started and install all dependencies.

### Develop
Run `npm run watch` to start the development server.
To test the extension, go to `chrome://extensions/` and enable developer mode.
Then click on `Load unpacked` and select the `dist/` directory.

If you modify the manifest, or the .ts files at the root of the project, you will need to reload the extension to see the changes.
For everything related to the angular app, you can simply close and reopen the page.

### Lint
https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E
This project relies on eslint and prettier to enforce a unified and clean code style.

Run `npm run lint` to lint the project ; also a hook is setup to run the linter before each commit. 
Please do not commit if the linter fails and do not disable the linter.

### Test
Currently, tests are not implemented.

### Build
Run `ng build` to build the project for production. 
The build artifacts will be stored in the `dist/` directory.

## Contributing

### Contributors
<a href = "https://github.com/madushadhanushka/simple-sqlite/graphs/contributors">
  <img src = "https://contrib.rocks/image?repo=madushadhanushka/simple-sqlite"/>
</a>

### Issues
If you find a bug or have a feature request, please open an issue on the issue tracker.

### Pull Requests
Pull requests are welcome. Please make sure that your changes reflect the vision of the project.

## License
This project is licensed under Commons Clause License. 
Lern more at https://commonsclause.com.

## Credits
Made with ❤️ by Matthieu Delarue, 2023.
This project is inspired by the Digital Wellbeing feature, introduced in Android 9 and made by Google.
