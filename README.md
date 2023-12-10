<p align="center">
     
  <img width="150" src="https://github.com/MatthewDlr/Digital-Awareness/assets/57815261/0ec3f885-5c1a-4898-b351-fce217ca932b" alt="Digital Awareness logo">
</p>

<h3 align="center">Digital Awareness</h3>
<h4 align="center">Unlearn bad digital habits</h4>


<p align="center">
  
  <img width="175" src="https://img.shields.io/badge/Google_chrome-4285F4?style=for-the-badge&logo=Google-chrome&logoColor=white" alt="Google Chrome"> 
  <p align="center">Coming soon to the Chrome Web Store</p>

</p>

<br>

## Features
✅ Prevent yourself from opening distracting websites mindlessly <br>
✅ Automatically adapts based on your usage <br>
✅ Get insights on your digital habits <br>
✅ Add your own websites <br>
✅ Customize the page with quotes, breathing exercises or your own goals <br>
✅ Prevent doom scrolling <br>
✅ Dark mode <br>
✅ Absolutely free <br>

## Development Setup
[![Build Extension](https://github.com/MatthewDlr/Digital-Awareness/actions/workflows/build.yml/badge.svg)](https://github.com/MatthewDlr/Digital-Awareness/actions/workflows/build.yml)

### Tech Stack
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=Webpack&logoColor=white)

### Installation
Run `npm install` to get started and install all dependencies.

### Develop
Run `npm run watch` to start the development server.
To test the extension, go to `chrome://extensions/` and enable developer mode.
Then click on `Load unpacked` and select the `dist/` directory.

Currently, you can't use `ng serve` to start the development server since it doesn't run the custom webpack configuration, some files are missing from the compilation.

If you modify the manifest, or the .ts files at the root of the project, you will need to reload the extension to see the changes.
For everything related to the angular app, you can simply close and reopen the page.

### Dependencies
Please, be cautious when adding new dependencies to the project. <br>
If you need to add a new dependency, make sure it is really necessary and that it is well maintained.

If a dependency is creating conflicts, never, ever, use `--force` to add it anyway<br>

### Lint
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E) <br>
This project relies on eslint and prettier to enforce a unified and clean code style.

Run `npm run lint` to lint the project ; also a hook is setup to run the linter before each commit. <br>
Please **do not** commit if the linter fails and **do not** disable the linter.

### Test
Currently, tests are not implemented.

### Build
Run `ng build` to build the project for production. 
The build artifacts will be stored in the `dist/` directory.

## Contributing
⭐ Star us, it motivates us a lot!

### Issues
If you find a bug or have a feature request, please open an issue on the [issues tracker](https://github.com/MatthewDlr/Digital-Awareness/issues).

### Pull Requests
Pull requests are welcome. Please make sure that your changes reflect the vision of the project.

## License
This project is licensed under Commons Clause License. <br>
Learn more at https://commonsclause.com.

## Credits
Made with ❤️ by Matthieu Delarue, 2023. <br>
This project is inspired by the [Digital Wellbeing experiment](https://www.android.com/digital-wellbeing), introduced in Android 9 by Google.
