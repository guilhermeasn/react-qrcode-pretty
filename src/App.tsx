import { useState } from "react";
import { Accordion, Button, Col, Container, FloatingLabel, Form, Navbar, Row } from "react-bootstrap";
import Code from './Code';

import { QrcodeCanvas, QrcodeColorEffect, QrcodeFormat, QrcodeProps, QrcodeStyle, QrcodeSVG, useQrcodeDownload } from "react-qrcode-pretty";
// import { QrcodeCanvas, QrcodeColorEffect, QrcodeFormat, QrcodeProps, QrcodeStyle, QrcodeSVG, useQrcodeDownload } from "./qrcode";

export default function App() {

    const variants : Array<QrcodeStyle> = [
        'standard',
        'rounded',
        'dots',
        'circle',
        'fluid',
        'gravity',
        'reverse',
        'shower',
        'morse',
        'italic',
        'inclined'
    ];

    const colorEffect : Array<QrcodeColorEffect> = [
        'gradient-dark-vertical',
        'gradient-dark-horizontal',
        'gradient-dark-diagonal',
        'gradient-light-vertical',
        'gradient-light-horizontal',
        'gradient-light-diagonal',
        'colored',
        'shades',
        'none'
    ];

    const [ format, setFormat ] = useState<QrcodeFormat>('canvas');

    const [ setQrcode, onDownload, isReady ] = useQrcodeDownload();

    const [ props, setProps ] = useState<QrcodeProps<typeof format>>({
        value:'react-qrcode-pretty',
        variant: {
            eyes: 'gravity',
            body: 'fluid'
        },
        color: {
            eyes: '#223344',
            body: '#335577'
        },
        colorEffect: {
            eyes: 'none',
            body: 'none'
        },
        bgColor: '#ddeeff',
        // internalProps: {
        //     className: 'img-fluid my-2'
        // },
        padding: 20,
        margin: 20,
        bgRounded: true,
        divider: true,
        onReady: setQrcode
    });
    
    return <>

        <header>

            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand>
                        react-qrcode-pretty
                    </Navbar.Brand>
                    <a href="https://github.com/guilhermeasn/react-qrcode-pretty" target='_blank' rel='noreferrer noopener' title="Repository">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="36" height="36" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                </Container>
            </Navbar>

        </header>

        <main>

            <Container className="my-3">
                <Row>

                    <Col lg={ 6 }>

                        <Form as='div' className="mt-3">

                            <div className='d-flex justify-content-center mb-3'>

                                <Form.Check
                                    className='mx-2'
                                    type="switch"
                                    checked={ !!props.image }
                                    label='Image'
                                    onChange={ () => setProps({ ...props, image: props.image ? undefined : { src: './scanme.png' } }) }
                                />

                                <Form.Check
                                    className='mx-2'
                                    type="switch"
                                    checked={ props.image && typeof props.image === 'object' ? props.image.overlap : false }
                                    label='Image Overlap'
                                    onChange={ () => setProps({ 
                                        ...props, 
                                        image: typeof props.image === 'object' 
                                            ? { ...props.image, overlap: !props.image.overlap } 
                                            : props.image 
                                    }) }
                                    disabled={ !props.image }
                                />

                            </div>

                            <FloatingLabel label='Value' className="mb-3">
                                <Form.Control
                                    value={ props.value }
                                    maxLength={ 500 }
                                    onChange={ (input: any) => setProps({ ...props, value: input.currentTarget.value }) }
                                />
                            </FloatingLabel>

                            <FloatingLabel label='Format' className="mb-3">
                                <Form.Select
                                    value={ format }
                                    onChange={ (input: any) => setFormat(input.currentTarget.value) }
                                >
                                    <option value='canvas'>Canvas (.png)</option>
                                    <option value='SVG'>SVG (.svg)</option>
                                </Form.Select>
                            </FloatingLabel>

                            <hr />

                            <div className='mb-3 d-flex justify-content-center'>
                                <Form.Check
                                    type="switch"
                                    checked={ props.divider }
                                    label='Body Divider'
                                    onChange={ () => setProps({ ...props, divider: !props.divider }) }
                                />
                            </div>

                            <FloatingLabel label='Eyes Variant' className="mb-3">
                                <Form.Select
                                    value={ typeof props.variant === 'object' ? props.variant.eyes : props.variant }
                                    onChange={ (input: any) => setProps({ ...props, variant: { eyes: input.currentTarget.value, body: typeof props.variant === 'object' ? props.variant.body : (props.variant ?? 'standard') } }) }
                                >
                                    { variants.map(v => <option key={ v } value={ v }>{ v }</option>) }
                                </Form.Select>
                            </FloatingLabel>

                            <FloatingLabel label='Body Variant' className="mb-3">
                                <Form.Select
                                    value={ typeof props.variant === 'object' ? props.variant.body : props.variant }
                                    onChange={ (input: any) => setProps({ ...props, variant: { body: input.currentTarget.value, eyes: typeof props.variant === 'object' ? props.variant.eyes : (props.variant ?? 'standard') } }) }
                                >
                                    { variants.map(v => <option key={ v } value={ v }>{ v }</option>) }
                                </Form.Select>
                            </FloatingLabel>

                            <hr />

                            <FloatingLabel label='Eyes Color Effect' className="mb-3">
                                <Form.Select
                                    value={ typeof props.colorEffect === 'object' ? props.colorEffect.eyes : props.colorEffect }
                                    onChange={ (input: any) => setProps({ ...props, colorEffect: { eyes: input.currentTarget.value, body: typeof props.colorEffect === 'object' ? props.colorEffect.body : (props.colorEffect ?? 'none') } }) }
                                >
                                    { colorEffect.map(v => <option key={ v } value={ v }>{ v }</option>) }
                                </Form.Select>
                            </FloatingLabel>

                            <FloatingLabel label='Body Color Effect' className="mb-3">
                                <Form.Select
                                    value={ typeof props.colorEffect === 'object' ? props.colorEffect.body : props.colorEffect }
                                    onChange={ (input: any) => setProps({ ...props, colorEffect: { body: input.currentTarget.value, eyes: typeof props.colorEffect === 'object' ? props.colorEffect.eyes : (props.colorEffect ?? 'none') } }) }
                                >
                                    { colorEffect.map(v => <option key={ v } value={ v }>{ v }</option>) }
                                </Form.Select>
                            </FloatingLabel>

                            <hr />

                            <div className='mb-3 d-flex justify-content-center'>
                                <Form.Check
                                    type="switch"
                                    checked={ props.bgRounded }
                                    label='Background Rounded'
                                    onChange={ () => setProps({ ...props, bgRounded: !props.bgRounded }) }
                                />
                            </div>

                            <FloatingLabel label='Eyes Color' className="mb-3">
                                <Form.Control
                                    className='w-100'
                                    type='color'
                                    value={ typeof props.color === 'object' ? props.color.eyes : props.color }
                                    onChange={ (input: any) => setProps({ ...props, color: { eyes: input.currentTarget.value, body: typeof props.color === 'object' ? props.color.body : (props.color ?? '#000') } }) }
                                />
                            </FloatingLabel>

                            <FloatingLabel label='Body Color' className="mb-3">
                                <Form.Control
                                    className='w-100'
                                    type='color'
                                    value={ typeof props.color === 'object' ? props.color.body : props.color }
                                    onChange={ (input: any) => setProps({ ...props, color: { body: input.currentTarget.value, eyes: typeof props.color === 'object' ? props.color.eyes : (props.color ?? '#000') } }) }
                                />
                            </FloatingLabel>

                            <FloatingLabel label='Background Color' className="mb-3">
                                <Form.Control
                                    className='w-100'
                                    type='color'
                                    value={ props.bgColor }
                                    onChange={ (input: any) => setProps({ ...props, bgColor: input.currentTarget.value }) }
                                />
                            </FloatingLabel>

                        </Form>

                    </Col>

                    <Col lg={ 6 } className='center text-center'>

                        <Accordion className='my-3'>
                            <Accordion.Item eventKey='0'>
                                <Accordion.Button className='text-dark bg-secondary bg-opacity-25 border border-secondary'>
                                    React JS Code
                                </Accordion.Button>
                                <Accordion.Body className='text-start bg-secondary bg-opacity-10'>
                                    <Code format={ format } qrCodeProps={ props } />
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>

                        { format ===  'canvas'
                            ? <QrcodeCanvas { ...props } />
                            : <QrcodeSVG { ...props } />
                        }<br/>
                        
                        <Button
                            className='mb-3'
                            onClick={ () => onDownload('qrcode') }
                            variant='outline-primary'
                            title="Download qrcode"
                            disabled={ !isReady }
                        >Download</Button>

                    </Col>

                </Row>
            </Container>

        </main>

        <footer>

            <Container className='d-flex justify-content-between my-3 border-top'>
                <small className='text-secondary'>
                    MIT License
                </small>
                <a href='http://gn.dev.br/' title='http://gn.dev.br/' className='small text-secondary' target='_blank' rel='noreferrer noopener'>
                    &lt;gn.dev.br/&gt;
                </a>
            </Container>

        </footer>

    </>;

}