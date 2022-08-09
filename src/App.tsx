import { useState } from "react";
import { QrCode, QrCodeProps } from "react-qrcode-pretty";

export default function App() {

    const [ props, setProps ] = useState<QrCodeProps>({
        value:'react-qrcode-pretty',
        variant: {
            eyes: 'gravity',
            body: 'fluid'
        },
        color: {
            eyes: '#234',
            body: '#357'
        },
        bgColor: '#def',
        padding: '2rem',
        bgRounded: true,
        divider: true
    });

    return (

        <div style={{ margin: '30px auto', textAlign: 'center' }}>
            <QrCode { ...props } />
            <form style={{ marginTop: '10px' }}>
                <div>
                    <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Value</label>
                    <input value={ props.value } onChange={ input => setProps({ ...props, value: input.currentTarget.value }) } />
                </div>
            </form>
        </div>

    );
}