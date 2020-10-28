import { expect } from 'chai';
import * as vscode from 'vscode';

import * as config from '../../config';

suite('getMappings', () => {
    vscode.window.showInformationMessage('Starting getMappings tests.');

    test('Raise error if invalid setting', () => {
        expect(() => {
            config.getMappings('invalidSetting');
        }).to.throw('Internal error: invalidSetting is not a valid setting');
    });
});
