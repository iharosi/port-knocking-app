# Port Knocking App

A user-friendly application that performs port knocking by sending UDP packets to specified ports then checks the status of a TCP port to verify its availability. Built with Electron, React, and TypeScript.

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

## Generate macOS electron app

For a standalone Mac distributable generate a Self-Signed Certificate in Keychain Access:

1. Open Keychain Access from the `Utilities` folder in your `Applications`.
1. From the menu, choose `Keychain Access` > `Certificate Assistant` > `Create a Certificate`.
1. Follow the prompts to create a self-signed certificate, using settings like:

- Name: My Self-Signed Certificate
- Identity Type: Self Signed Root
- Certificate Type: Code Signing
- Extension: Key usage, Critical: YES, Usage: Digital Signature
- Extension: Extended Key usage, Critical: YES, Purpose #1: Code Signing

Add the following line to your `.env` file:

```bash
IDENTITY=My Self-Signed Certificate
```

Package your application (this will sign the app with your self-signed certificate):

```bash
npm run package -- --platform=darwin --arch=universal
```

Codesign your macOS app:

```bash
codesign --deep --force --verify --verbose --sign "My Self-Signed Certificate" ./out/port-knocking-app-darwin-universal/port-knocking-app.app
```

After signing, it's good practice to verify the signature to ensure it's correctly applied:

```bash
codesign -dv --verbose=4 ./out/port-knocking-app-darwin-universal/port-knocking-app.app
```

Create the app dmg:

```bash
npm run make -- --platform=darwin --arch=universal --skip-package
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
