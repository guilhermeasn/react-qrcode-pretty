import { QrCodePart, QrCodeProps } from "react-qrcode-pretty";

function Space() {

    return <>&nbsp;&nbsp;</>;

}

export default function Code(qrCodeProps : QrCodeProps) {

    return (

        <blockquote className="font-monospace small text-dark">
            <p>{ "import { QrCode } from 'react-qrcode-pretty';" }</p>
            <p>{ `export default function QrCodeCustom({ value = '${qrCodeProps.value}' }) {` }</p>
            <p><Space />return (</p>
            <p>
                <Space /><Space />{ "<QrCode" }<br />
                <Space /><Space /><Space />{ "value={ value }" }<br />
                <Space /><Space /><Space />{ "variant={{" }<br />
                <Space /><Space /><Space /><Space />{ `eyes: '${(qrCodeProps.variant as QrCodePart<string>).eyes}',` }<br />
                <Space /><Space /><Space /><Space />{ `body: '${(qrCodeProps.variant as QrCodePart<string>).body}'` }<br />
                <Space /><Space /><Space />{ "}}" }<br />
                <Space /><Space /><Space />{ "color={{" }<br />
                <Space /><Space /><Space /><Space />{ `eyes: '${(qrCodeProps.color as QrCodePart<string>).eyes}',` }<br />
                <Space /><Space /><Space /><Space />{ `body: '${(qrCodeProps.color as QrCodePart<string>).body}'` }<br />
                <Space /><Space /><Space />{ "}}" }<br />
                <Space /><Space /><Space />{ `padding={ ${qrCodeProps.padding} }` }<br />
                <Space /><Space /><Space />{ `margin={ ${qrCodeProps.padding} }` }<br />
                <Space /><Space /><Space />{ `bgColor='${qrCodeProps.bgColor}'` }<br />
                { qrCodeProps.bgRounded ? <><Space /><Space /><Space />{ `bgRounded` }<br /></> : '' }
                { qrCodeProps.divider ? <><Space /><Space /><Space />{ `divider` }<br /></> : '' }
                <Space /><Space />{ "/>" }
            </p>
            <p><Space />);</p>
            <p>{ "}" }</p>
        </blockquote>

    );

}