import qrcodeGenerator from 'qrcode-generator';

type AppProps = {
    value  : string;
    level ?: ErrorCorrectionLevel;
}

type QrcodeModule = {
    fill : boolean;
    row  : number;
    col  : number;
    posY : 'start' | 'middle' | 'end' | 'one';
    posX : 'start' | 'middle' | 'end' | 'one';
    refY : 'left' | 'center' | 'right';
    refX : 'top' | 'center' | 'bottom';
}

function App(props : AppProps) {

    const qrcode : QRCode = qrcodeGenerator(0, props.level ?? 'Q');
    qrcode.addData(props.value);
    qrcode.make();

    const modules : number = qrcode.getModuleCount();
    let qrcodeClasses : QrcodeModule[][] = [];
    let qrcodeLine    : QrcodeModule[] = [];

    let topLimit : number = Math.floor(modules/3);
    let middleLimit : number = modules - Math.floor(modules/3);

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
                refY: col < topLimit ? 'left' : col < middleLimit ? 'center' : 'right',
                refX: row < topLimit ? 'top' : row < middleLimit ? 'center' : 'bottom'
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
                        <div key={ i } className={ `qrcode-module ${ module.fill ? 'qrcode-fill' : '' } qrcode-row-${ module.posX } qrcode-col-${ module.posY } qrcode-row-${ module.refX } qrcode-col-${ module.refY }` } />
                    )) }
                </div>
            )) }

            <br />

            {/* <img src={ qrcode.createDataURL(5, 0) } alt='' /> */}

        </div>

    );

}

export default App;
