import React from 'react';
import renderer from 'react-test-renderer';
import { QrCode } from '../src';

describe('Testing react-qrcode-pretty', () => {

    test('Qrcode basic render', () => {

        const component = renderer.create(
            <QrCode value='react-qrcode-pretty' />
        );
        
        // expect(component.toJSON()).toMatchSnapshot();
        expect(component.toJSON()).toEqual({
            type: 'canvas',
            props: {
              width: 250,
              height: 250,
              style: {
                margin: undefined,
                padding: undefined,
                backgroundColor: '#FFF',
                borderRadius: undefined
              },
              className: undefined
            },
            children: null
        });

    });

});