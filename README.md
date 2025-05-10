# react-qrcode-pretty

[![pages-build-deployment](https://github.com/guilhermeasn/react-qrcode-pretty/actions/workflows/pages/pages-build-deployment/badge.svg?branch=example)](https://guilhermeasn.github.io/react-qrcode-pretty/)
[![downloads](https://img.shields.io/npm/dt/react-qrcode-pretty)](https://www.npmjs.com/package/react-qrcode-pretty/)
[![npm](https://img.shields.io/npm/v/react-qrcode-pretty.svg)](https://www.npmjs.com/package/react-qrcode-pretty/v/latest)

Qrcode generator for react apps with many customization options.

![Qrcode_URL](https://raw.githubusercontent.com/guilhermeasn/react-qrcode-pretty/master/examples/qrcode _url.png)

[Qrcode generator website](https://guilhermeasn.github.io/react-qrcode-pretty/)

## Installation

Run the command below in the terminal to install **react-qrcode-pretty** in your project

```
npm i react-qrcode-pretty
```

Or with Yarn

```
yarn add react-qrcode-pretty
```

## Resources

- **QrcodeCanvas**: React Element to generate a Qrcode with canvas.
- **QrcodeSVG**: React Element to generate a Qrcode with SVG.
- **useQrcodeDownload**: React Hook to download Qrcode in browser.

## Qrcode Props

|Prop|Type|Default|Details|
|---|---|---|---|
| value | `string` | | Qrcode payload (required) |
| size | `number` | auto | Size of the qrcode without margin and padding |
| color | `string` <br /> `{ 'eyes': string, 'body': string }` | '#000000' | Foreground color for the entire qrcode or for each part (eyes and body) of the qrcode |
| colorEffect | `gradient-dark-vertical` <br /> `gradient-dark-horizontal` <br /> `gradient-dark-diagonal` <br /> `gradient-light-vertical` <br /> `gradient-light-horizontal` <br /> `gradient-light-diagonal` <br /> `colored` <br /> `none` <br /> `{ 'eyes': colorEffect, 'body': colorEffect }` | 'none' | Apply effects to coloring |
| mode | `Numeric` <br /> `Alphanumeric` <br /> `Byte` <br /> `Kanji` | 'Byte' | Mode that payload (value) will be logged |
| level | `L` <br /> `M` <br /> `Q` <br /> `H` | 'M' | Error correction level |
| modules | `[0-40]` | 0 | Number of qrcode modules. 0 is auto |
| image | `string` <br /> `{ src: string; width ?: number; height ?: number; positionX ?: number; positionY ?: number; overlap ?: boolean; }` | undefined | Settings for the image to be inserted into the qrcode |
| margin | `number` | 0 | Margin size. Area without background color |
| padding | `number` | 0 | Padding size. Area with background color |
| variant | `standard` <br /> `rounded`  <br /> `dots` <br /> `circle` <br /> `fluid` <br /> `reverse` <br /> `shower` <br /> `gravity`  <br /> `morse` <br /> `{ 'eyes': variant, 'body': variant }` | 'standard' | Style applied to the entire qrcode or each part (eyes and body) of it |
| divider | `boolean` | false | Active a small separation between the qrcode body points |
| bgColor | `string` | '#FFFFFF' | Background color |
| bgRounded | `boolean` | false | Background color rounded |
| internalProps | `HTMLAttributes<HTMLCanvasElement \| SVGSVGElements>` | undefined | The internal props attributes |
| onReady | `(element : HTMLCanvasElement \| SVGSVGElements) => void` | undefined | Provides element properties and methods when available. To be used with the useQrcodeDownload hook. |

## Code Example

```js
import {
    QrcodeCanvas, 
    useQrcodeDownload
} from "react-qrcode-pretty";

export function QrcodeCustom({ value = 'react-qrcode-pretty' }) {

    const [ setQrcode, download, isReady ] = useQrcodeDownload();

    return (

        <div>

            <QrcodeCanvas
                value={ value }
                variant={{
                    eyes: 'gravity',
                    body: 'fluid'
                }}
                color={{
                    eyes: '#223344',
                    body: '#335577'
                }}
                padding={ 20 }
                margin={ 20 }
                bgColor='#ddeeff'
                onReady={ setQrcode }
                bgRounded
                divider
            />

            <br />

            <button
                onClick={ () => download('qrcode_file_name') }
                disabled={ !isReady }
            >Download Qrcode</button>

        </div>

    );

}
```

## Qrcode Examples

![Qrcode example](https://raw.githubusercontent.com/guilhermeasn/react-qrcode-pretty/master/examples/qrcode_example_01.png)
![Qrcode example](https://raw.githubusercontent.com/guilhermeasn/react-qrcode-pretty/master/examples/qrcode_example_02.png)
![Qrcode example](https://raw.githubusercontent.com/guilhermeasn/react-qrcode-pretty/master/examples/qrcode_example_03.png)
![Qrcode example](https://raw.githubusercontent.com/guilhermeasn/react-qrcode-pretty/master/examples/qrcode_example_04.png)
![Qrcode example](https://raw.githubusercontent.com/guilhermeasn/react-qrcode-pretty/master/examples/qrcode_example_05.png)
![Qrcode example](https://raw.githubusercontent.com/guilhermeasn/react-qrcode-pretty/master/examples/qrcode_example_06.png)
![Qrcode example](https://raw.githubusercontent.com/guilhermeasn/react-qrcode-pretty/master/examples/qrcode_example_07.png)
![Qrcode example](https://raw.githubusercontent.com/guilhermeasn/react-qrcode-pretty/master/examples/qrcode_example_08.png)
![Qrcode example](https://raw.githubusercontent.com/guilhermeasn/react-qrcode-pretty/master/examples/qrcode_example_09.png)
![Qrcode example](https://raw.githubusercontent.com/guilhermeasn/react-qrcode-pretty/master/examples/qrcode_example_10.png)

[Qrcode generator website](https://guilhermeasn.github.io/react-qrcode-pretty/)

## Author

* **Guilherme Neves** - [github](https://github.com/guilhermeasn/) - [website](https://gn.dev.br/)

## License

This project is under the MIT license - see file [LICENSE](https://github.com/guilhermeasn/react-qrcode-pretty/blob/master/LICENSE) for details.
