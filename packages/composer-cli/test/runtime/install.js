/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const Admin = require('composer-admin');
const BusinessNetworkDefinition = Admin.BusinessNetworkDefinition;
const InstallCmd = require('../../lib/cmds/runtime/installCommand.js');
const CmdUtil = require('../../lib/cmds/utils/cmdutils.js');

//require('../lib/deploy.js');
require('chai').should();

const chai = require('chai');
const sinon = require('sinon');
chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

let testBusinessNetworkId = 'net-biz-TestNetwork-0.0.1';
let testBusinessNetworkDescription = 'Test network description';
let mockBusinessNetworkDefinition;
let mockAdminConnection;

describe('composer install runtime CLI unit tests', function () {

    let sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        mockBusinessNetworkDefinition = sinon.createStubInstance(BusinessNetworkDefinition);
        mockBusinessNetworkDefinition.getIdentifier.returns(testBusinessNetworkId);
        mockBusinessNetworkDefinition.getDescription.returns(testBusinessNetworkDescription);

        mockAdminConnection = sinon.createStubInstance(Admin.AdminConnection);
        mockAdminConnection.createProfile.resolves();
        mockAdminConnection.connect.resolves();
        mockAdminConnection.deploy.resolves();

        sandbox.stub(BusinessNetworkDefinition, 'fromArchive').returns(mockBusinessNetworkDefinition);
        sandbox.stub(CmdUtil, 'createAdminConnection').returns(mockAdminConnection);
        sandbox.stub(process, 'exit');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Install handler() method tests', function () {

        it('Good path, all parms correctly specified.', function () {

            let argv = {installId: 'PeerAdmin'
                       ,installSecret: 'Anything'
                       ,businessNetworkName: 'org-acme-biznet'
                       ,connectionProfileName: 'testProfile'};


            return InstallCmd.handler(argv)
            .then ((result) => {
                sinon.assert.calledOnce(CmdUtil.createAdminConnection);
                sinon.assert.calledOnce(mockAdminConnection.connect);
                sinon.assert.calledWith(mockAdminConnection.connect, argv.connectionProfileName, argv.installId, argv.installSecret, null);
                sinon.assert.calledOnce(mockAdminConnection.install);
                sinon.assert.calledWith(mockAdminConnection.install, argv.businessNetworkName, {});
            });
        });

    });

});
