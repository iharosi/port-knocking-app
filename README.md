# Port Knocking App

A simple port knocking application built with Electron, React, and TypeScript.

![App Screenshot](https://github.com/iharosi/port-knocking-app/blob/main/port-knocking-app.png?raw=true)

## Installation

Clone the repository:

```bash
git clone https://github.com/iharosi/port-knocking-app.git
```

Install dependencies:

```bash
npm install
```

## Development

Run the application:

```bash
npm start
```

## Publish electron app

Package your application into a platform-specific executable bundle:

```bash
npm run package
```

For Mac distributable create a Self-Signed Certificate in Keychain and Sign Your App. 

```bash
codesign --deep --force --verify --verbose --sign "YourCertificateName" /path/to/your/app.app
```

Publish the application to the publish targets defined in the Forge config:

```bash
npm run publish
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
