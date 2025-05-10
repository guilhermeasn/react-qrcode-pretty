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