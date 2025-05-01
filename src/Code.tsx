import { Fragment } from "react";
// import { QrCodePart, QrCodeProps } from "react-qrcode-pretty";
import { QrCodePart, QrCodeProps } from "./qrcode";

function Space({ size = 1 }) {
    return <>{
        Array(size).fill(null).map((_, key) => (
            <Fragment key={ key }>&nbsp;&nbsp;</Fragment> 
        ))
    }</>;
}

export default function Code(qrCodeProps : QrCodeProps) {

    return (

        <blockquote className="font-monospace small text-dark">
            <p>{ "import { QrCode } from 'react-qrcode-pretty';" }</p>
            <p>{ `export default function QrCodeCustom({ value = '${qrCodeProps.value}' }) {` }</p>
            <p><Space />return (</p>
            <p>
                <Space size={ 2 } />{ "<QrCode" }<br />
                <Space size={ 3 } />{ "value={ value }" }<br />
                <Space size={ 3 } />{ "variant={{" }<br />
                <Space size={ 4 } />{ `eyes: '${(qrCodeProps.variant as QrCodePart<string>).eyes}',` }<br />
                <Space size={ 4 } />{ `body: '${(qrCodeProps.variant as QrCodePart<string>).body}'` }<br />
                <Space size={ 3 } />{ "}}" }<br />
                <Space size={ 3 } />{ "color={{" }<br />
                <Space size={ 4 } />{ `eyes: '${(qrCodeProps.color as QrCodePart<string>).eyes}',` }<br />
                <Space size={ 4 } />{ `body: '${(qrCodeProps.color as QrCodePart<string>).body}'` }<br />
                <Space size={ 3 } />{ "}}" }<br />
                <Space size={ 3 } />{ "colorEffect={{" }<br />
                <Space size={ 4 } />{ `eyes: '${(qrCodeProps.colorEffect as QrCodePart<string>).eyes}',` }<br />
                <Space size={ 4 } />{ `body: '${(qrCodeProps.colorEffect as QrCodePart<string>).body}'` }<br />
                <Space size={ 3 } />{ "}}" }<br />
                <Space size={ 3 } />{ `padding={ ${qrCodeProps.padding} }` }<br />
                <Space size={ 3 } />{ `margin={ ${qrCodeProps.padding} }` }<br />
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
