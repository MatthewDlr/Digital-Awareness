<p align="center">
     
  <img width="150" src="https://github.com/MatthewDlr/Digital-Awareness/assets/57815261/0ec3f885-5c1a-4898-b351-fce217ca932b" alt="Digital Awareness logo">
</p>

<h3 align="center">Digital Awareness</h3>
<h4 align="center">Unlearn bad digital habits</h4>

<p align="center">

<a href="https://chromewebstore.google.com/detail/digital-awareness/eciijpgppecgdjfemignfbgnnhnmnkia?hl=en">
  <img src="https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/HRs9MPufa1J1h5glNhut.png" alt="Chrome Web Store" style="width: 200px">
</a>
</p>

<br>

## Features

✅ Prevent yourself from opening distracting websites mindlessly <br>
✅ Automatically adapts based on your usage <br>
✅ Get insights on your digital habits <br>
✅ Add your own websites <br>
✅ Customize with quotes, breathing exercises or your own goals <br>
✅ Prevent doom scrolling <br>
✅ Dark mode <br>
✅ Absolutely free <br>
✅ Compatible with any Chromium-based web browser <br>

## Development Setup

[![Deployment](https://github.com/MatthewDlr/Digital-Awareness/actions/workflows/deployment.yml/badge.svg)](https://github.com/MatthewDlr/Digital-Awareness/actions/workflows/deployment.yml)
[![CodeQL](https://github.com/MatthewDlr/Digital-Awareness/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/MatthewDlr/Digital-Awareness/actions/workflows/github-code-scanning/codeql)

### Tech Stack

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=Webpack&logoColor=white)

### Installation

Run `npm install` to get started and install all dependencies.

### Develop

Run `npm run watch` to start the development server.
To test the extension, go to `chrome://extensions/` and enable developer mode.
Then click on `Load unpacked` and select the output folder

Please do not use angular commands like `ng serve`and `ng build` since it doesn't run the custom webpack configuration and custom flags, it results in missing files from the compilation output and unexpected behaviors across the extension. <br>

Be aware that when the extension in running in development mode, it behaves differently ; all timers are much faster and won't adapt to your usage and, you'll also get much more logs in the page console. To avoid affecting the user experience, please limit your own logging to development mode using the `isDevMode()` function of Angular.

If you modify the manifest, or the .ts files at the root of the project, you will need to reload the extension to see your changes.
For everything related to the angular app, you can simply reload the page.

### Dependencies

![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) <br>
Please, be cautious when adding new dependencies to the project. <br>
If you need to add a new dependency, make sure it is really necessary and that it is well maintained.

If a dependency is creating conflicts, never, ever, use `--force` to add it anyway<br>

### Lint

![ESlint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E) <br>
This project relies on eslint and prettier to enforce a unified and clean code style.

Run `npm run lint` to lint the project ; also a hook is setup to run the linter before each commit. <br>
Please **do not** commit if the linter fails and **do not** disable the linter.

### Tests

Currently, tests are not implemented.

### Build

Run `npm run build` to build the project for production.
The build artifacts will be stored in the `dist/` directory.

## Contributing

⭐ Star us, it motivates us a lot!

### Issues

If you find a bug or have a feature request, please open an issue on the [issues tracker](https://github.com/MatthewDlr/Digital-Awareness/issues).

### Pull Requests

Pull requests are welcome. Please make sure that your changes reflect the vision of the project.

## Credits

Made with ❤️ by Matthieu Delarue, 2023. <br>

**Inspiration sources** <br>
<a href="https://github.com/patresk/consistency" target="_blank">Consistency,</a> a Chrome extension made by [@patresk](https://github.com/patresk). <br>
<a href="https://www.android.com/digital-wellbeing" target="_blank">Digital Wellbeing,</a> an experiment introduced in Android 9 by Google. <br>

## License

This project is licensed under Commons Clause License. <br>
Learn more at https://commonsclause.com.
