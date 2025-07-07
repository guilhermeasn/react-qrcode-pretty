import { Fragment } from "react";
import { QrcodeFormat, QrcodePart, QrcodeProps } from "react-qrcode-pretty";
// import { QrcodeFormat, QrcodePart, QrcodeProps } from "./qrcode";

function Space({ size = 1 }) {
    return <>{
        Array(size).fill(null).map((_, key) => (
            <Fragment key={ key }>&nbsp;&nbsp;</Fragment> 
        ))
    }</>;
}

type CodeProps = {
    format: QrcodeFormat,
    qrCodeProps: QrcodeProps<'canvas'> | QrcodeProps<'SVG'>
}

export default function Code({ format, qrCodeProps } : CodeProps) {

    return (

        <blockquote className="font-monospace small text-dark">
            <p>{ format === 'canvas' ? "import { QrcodeCanvas } from 'react-qrcode-pretty';" : "import { QrcodeSVG } from 'react-qrcode-pretty';" }</p>
            <p>{ `export default function QrcodeCustom({ value = '${qrCodeProps.value}' }) {` }</p>
            <p><Space />return (</p>
            <p>
                <Space size={ 2 } />{ format === 'canvas' ? "<QrcodeCanvas" : "<QrcodeSVG" }<br />
                <Space size={ 3 } />{ "value={ value }" }<br />
                <Space size={ 3 } />{ "variant={{" }<br />
                <Space size={ 4 } />{ `eyes: '${(qrCodeProps.variant as QrcodePart<string>).eyes}',` }<br />
                <Space size={ 4 } />{ `body: '${(qrCodeProps.variant as QrcodePart<string>).body}'` }<br />
                <Space size={ 3 } />{ "}}" }<br />
                <Space size={ 3 } />{ "color={{" }<br />
                <Space size={ 4 } />{ `eyes: '${(qrCodeProps.color as QrcodePart<string>).eyes}',` }<br />
                <Space size={ 4 } />{ `body: '${(qrCodeProps.color as QrcodePart<string>).body}'` }<br />
                <Space size={ 3 } />{ "}}" }<br />
                <Space size={ 3 } />{ "colorEffect={{" }<br />
                <Space size={ 4 } />{ `eyes: '${(qrCodeProps.colorEffect as QrcodePart<string>).eyes}',` }<br />
                <Space size={ 4 } />{ `body: '${(qrCodeProps.colorEffect as QrcodePart<string>).body}'` }<br />
                <Space size={ 3 } />{ "}}" }<br />
                <Space size={ 3 } />{ `padding={ ${qrCodeProps.padding} }` }<br />
                <Space size={ 3 } />{ `margin={ ${qrCodeProps.margin} }` }<br />
                <Space size={ 3 } />{ `size={ ${qrCodeProps.size} }` }<br />
                <Space size={ 3 } />{ `bgColor='${qrCodeProps.bgColor}'` }<br />
                { qrCodeProps.bgRounded ? <><Space size={ 3 } />{ `bgRounded` }<br /></> : '' }
                { qrCodeProps.divider ? <><Space size={ 3 } />{ `divider` }<br /></> : '' }
                <Space size={ 2 } />{ "/>" }
            </p>
            <p><Space />);</p>
            <p>{ "}" }</p>
        </blockquote>

    );

}
