import { QrCode } from 'react-qrcode-pretty';

export default function QrCodeCustom({ value = 'react-qrcode-pretty' }) {

    return (

        <QrCode
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
            margin={ 30 }
            bgColor='#ddeeff'
            bgRounded
            divider
        />

    );

}