import copy from "copy-to-clipboard";
import { useEffect, useRef, useState } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";
import { QrcodeFormat, QrcodePart, QrcodeProps } from "react-qrcode-pretty";
import { codeToHtml } from "shiki";

type CodeProps = {
  format: QrcodeFormat,
  qrCodeProps: QrcodeProps<'canvas'> | QrcodeProps<'SVG'>
}

export default function Code({ format, qrCodeProps }: CodeProps) {

  const [codeText, setCodeText] = useState<string>();
  const [codeHtml, setCodeHtml] = useState<string>();

  const [show, setShow] = useState(false);
  const target = useRef(null);

  useEffect(() => {

    setCodeText(`

${format === 'canvas' ? "import { QrcodeCanvas } from 'react-qrcode-pretty';" : "import { QrcodeSVG } from 'react-qrcode-pretty';"}

export function QrcodeCustom({ value = '${qrCodeProps.value}' }) {
  return (
    ${format === 'canvas' ? "<QrcodeCanvas" : "<QrcodeSVG"}
      value={ value }
      variant={{
        eyes: '${(qrCodeProps.variant as QrcodePart<string>).eyes}',
        body: '${(qrCodeProps.variant as QrcodePart<string>).body}'
      }}
      color={{
        eyes: '${(qrCodeProps.color as QrcodePart<string>).eyes}',
        body: '${(qrCodeProps.color as QrcodePart<string>).body}'
      }}
      colorEffect={{
        eyes: '${(qrCodeProps.colorEffect as QrcodePart<string>).eyes}',
        body: '${(qrCodeProps.colorEffect as QrcodePart<string>).body}'
      }}
      padding={ ${qrCodeProps.padding} }
      margin={ ${qrCodeProps.margin} }
      size={ ${qrCodeProps.size} }
      bgColor='${qrCodeProps.bgColor}'
      ${qrCodeProps.bgRounded ? 'bgRounded' : ''}
      ${qrCodeProps.divider ? 'divider' : ''}
    />
  );
}

  `.trim())

  }, [format, qrCodeProps]);

  useEffect(() => {
    if(!codeText) return;
    codeToHtml(codeText, {
      lang: 'jsx',
      theme: 'material-theme-darker'
    }).then(html => setCodeHtml(html));
  }, [codeText]);

  useEffect(() => {
    if(show) {
      setTimeout(() => setShow(false), 3000);
    }
  }, [ show ])

  return codeHtml ? (

    <div>

      <div className="position-relative">

        <Button title="copy code" variant="secondary" className="btn-copy" ref={target} onClick={ () => codeText && copy(codeText) && setShow(true) } disabled={ !codeText }>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"></path>
          </svg>
        </Button>

        <Overlay target={target.current} show={show} placement="left">
        {(props) => (
          <Tooltip className="tooltip-success" id="button-tooltip" {...props}>
            Copied to clipboard!
          </Tooltip>
        )}
      </Overlay>

      </div>

      <div
        dangerouslySetInnerHTML={{ __html: codeHtml }}
        style={{ fontFamily: 'monospace' }}
      />

    </div>

  ): <></>;

}
