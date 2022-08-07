import qrcodeGenerator from 'qrcode-generator';

type AppProps = {
    value  : string;
    level ?: ErrorCorrectionLevel;
}

type QrcodeModule = {
    fill : boolean;
    row  : number;
    col  : number;
    posY  : 'start' | 'middle' | 'end' | 'one';
    posX  : 'start' | 'middle' | 'end' | 'one';
}

function App(props : AppProps) {

    const qrcode : QRCode = qrcodeGenerator(0, props.level ?? 'M');
    qrcode.addData(props.value);
    qrcode.make();

    const modules : number = qrcode.getModuleCount();
    let qrcodeClasses : QrcodeModule[][] = [];
    let qrcodeLine    : QrcodeModule[] = [];

    for(let row = 0; row < modules; row++) {

        for(let col = 0; col < modules; col++) {

            let fill = qrcode.isDark(row, col);

            let beforeColFill = col > 0 ? qrcode.isDark(row, col - 1) : false;
            let afterColFill = col < modules - 1 ? qrcode.isDark(row, col + 1) : false;

            let beforeRowFill = row > 0 ? qrcode.isDark(row - 1, col) : false;
            let afterRowFill = row < modules - 1 ? qrcode.isDark(row + 1, col) : false;


            qrcodeLine.push({
                fill,
                col,
                row,
                posY: (beforeColFill !== fill && afterColFill !== fill) ? 'one' :
                      (beforeColFill !== fill) ? 'start' :
                      (afterColFill !== fill) ? 'end' :
                      'middle',
                posX: (beforeRowFill !== fill && afterRowFill !== fill) ? 'one' :
                      (beforeRowFill !== fill) ? 'start' :
                      (afterRowFill !== fill) ? 'end' :
                      'middle',
            });

        }

        qrcodeClasses.push(qrcodeLine);
        qrcodeLine = [];

    }

    return (

        <div className="qrcode">
            { qrcodeClasses.map((line, i) => (
                <div key={ i } className='qrcode-line'>
                    { line.map((module, i) => (
                        <div key={ i } className={ `qrcode-module ${ module.fill ? 'qrcode-fill' : '' } qrcode-row-${ module.posX } qrcode-col-${ module.posY }` } />
                    )) }
                </div>
            )) }
        </div>

    );

}

export default App;
