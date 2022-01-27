// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint @typescript-eslint/member-ordering: 0 */
/// <reference lib="esnext.asynciterable" />
import { __asyncGenerator, __asyncValues, __await, __rest } from "tslib";
import { createPipelineFromOptions, isTokenCredential, signingPolicy } from "@azure/core-http";
import { logger } from "./log";
import "@azure/core-paging";
import { KeyVaultClient } from "./generated/keyVaultClient";
import { SDK_VERSION } from "./constants";
import { challengeBasedAuthenticationPolicy } from "../../keyvault-common/src";
import { DeleteKeyPoller } from "./lro/delete/poller";
import { RecoverDeletedKeyPoller } from "./lro/recover/poller";
import { LATEST_API_VERSION } from "./keysModels";
import { CryptographyClient } from "./cryptographyClient";
import { parseKeyVaultKeyIdentifier } from "./identifier";
import { getDeletedKeyFromDeletedKeyItem, getKeyFromKeyBundle, getKeyPropertiesFromKeyItem } from "./transformations";
import { createTraceFunction } from "../../keyvault-common/src";
export { CryptographyClient, parseKeyVaultKeyIdentifier, logger };
const withTrace = createTraceFunction("Azure.KeyVault.Keys.KeyClient");
/**
 * The KeyClient provides methods to manage {@link KeyVaultKey} in the
 * Azure Key Vault. The client supports creating, retrieving, updating,
 * deleting, purging, backing up, restoring and listing KeyVaultKeys. The
 * client also supports listing {@link DeletedKey} for a soft-delete enabled Azure Key
 * Vault.
 */
export class KeyClient {
    /**
     * Creates an instance of KeyClient.
     *
     * Example usage:
     * ```ts
     * import { KeyClient } from "@azure/keyvault-keys";
     * import { DefaultAzureCredential } from "@azure/identity";
     *
     * let vaultUrl = `https://<MY KEYVAULT HERE>.vault.azure.net`;
     * let credentials = new DefaultAzureCredential();
     *
     * let client = new KeyClient(vaultUrl, credentials);
     * ```
     * @param vaultUrl - the URL of the Key Vault. It should have this shape: `https://${your-key-vault-name}.vault.azure.net`
     * @param credential - An object that implements the `TokenCredential` interface used to authenticate requests to the service. Use the \@azure/identity package to create a credential that suits your needs.
     * @param pipelineOptions - Pipeline options used to configure Key Vault API requests. Omit this parameter to use the default pipeline configuration.
     */
    constructor(vaultUrl, credential, pipelineOptions = {}) {
        this.vaultUrl = vaultUrl;
        const libInfo = `azsdk-js-keyvault-keys/${SDK_VERSION}`;
        const userAgentOptions = pipelineOptions.userAgentOptions;
        pipelineOptions.userAgentOptions = {
            userAgentPrefix: userAgentOptions && userAgentOptions.userAgentPrefix
                ? `${userAgentOptions.userAgentPrefix} ${libInfo}`
                : libInfo
        };
        const authPolicy = isTokenCredential(credential)
            ? challengeBasedAuthenticationPolicy(credential)
            : signingPolicy(credential);
        const internalPipelineOptions = Object.assign(Object.assign({}, pipelineOptions), { loggingOptions: {
                logger: logger.info,
                allowedHeaderNames: [
                    "x-ms-keyvault-region",
                    "x-ms-keyvault-network-info",
                    "x-ms-keyvault-service-version"
                ]
            } });
        this.client = new KeyVaultClient(pipelineOptions.serviceVersion || LATEST_API_VERSION, createPipelineFromOptions(internalPipelineOptions, authPolicy));
    }
    /**
     * The create key operation can be used to create any key type in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * // Create an elliptic-curve key:
     * let result = await client.createKey("MyKey", "EC");
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param keyType - The type of the key. One of the following: 'EC', 'EC-HSM', 'RSA', 'RSA-HSM', 'oct'.
     * @param options - The optional parameters.
     */
    createKey(name, keyType, options) {
        let unflattenedOptions = {};
        if (options) {
            const { enabled, notBefore, expiresOn: expires } = options, remainingOptions = __rest(options, ["enabled", "notBefore", "expiresOn"]);
            unflattenedOptions = Object.assign(Object.assign({}, remainingOptions), { keyAttributes: {
                    enabled,
                    notBefore,
                    expires
                } });
        }
        return withTrace("createKey", unflattenedOptions, async (updatedOptions) => {
            const response = await this.client.createKey(this.vaultUrl, name, keyType, updatedOptions);
            return getKeyFromKeyBundle(response);
        });
    }
    /**
     * The createEcKey method creates a new elliptic curve key in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let result = await client.createEcKey("MyKey", { curve: "P-256" });
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    async createEcKey(name, options) {
        const keyType = (options === null || options === void 0 ? void 0 : options.hsm) ? "EC-HSM" /* ECHSM */ : "EC" /* EC */;
        return this.createKey(name, keyType, options);
    }
    /**
     * The createRSAKey method creates a new RSA key in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let result = await client.createRsaKey("MyKey", { keySize: 2048 });
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    async createRsaKey(name, options) {
        const keyType = (options === null || options === void 0 ? void 0 : options.hsm) ? "RSA-HSM" /* RSAHSM */ : "RSA" /* RSA */;
        return this.createKey(name, keyType, options);
    }
    /**
     * The createOctKey method creates a new OCT key in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let result = await client.createOctKey("MyKey", { hsm: true });
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    async createOctKey(name, options) {
        const keyType = (options === null || options === void 0 ? void 0 : options.hsm) ? "oct-HSM" /* OctHSM */ : "oct" /* Oct */;
        return this.createKey(name, keyType, options);
    }
    /**
     * The import key operation may be used to import any key type into an Azure Key Vault. If the
     * named key already exists, Azure Key Vault creates a new version of the key. This operation
     * requires the keys/import permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * // Key contents in myKeyContents
     * let result = await client.importKey("MyKey", myKeyContents);
     * ```
     * Imports an externally created key, stores it, and returns key parameters and properties
     * to the client.
     * @param name - Name for the imported key.
     * @param key - The JSON web key.
     * @param options - The optional parameters.
     */
    importKey(name, key, options) {
        let unflattenedOptions = {};
        if (options) {
            const { enabled, notBefore, expiresOn: expires, hardwareProtected: hsm } = options, remainingOptions = __rest(options, ["enabled", "notBefore", "expiresOn", "hardwareProtected"]);
            unflattenedOptions = Object.assign(Object.assign({}, remainingOptions), { keyAttributes: {
                    enabled,
                    notBefore,
                    expires,
                    hsm
                } });
        }
        return withTrace(`importKey`, unflattenedOptions, async (updatedOptions) => {
            const response = await this.client.importKey(this.vaultUrl, name, key, updatedOptions);
            return getKeyFromKeyBundle(response);
        });
    }
    /**
     * The delete operation applies to any key stored in Azure Key Vault. Individual versions
     * of a key can not be deleted, only all versions of a given key at once.
     *
     * This function returns a Long Running Operation poller that allows you to wait indefinitely until the key is deleted.
     *
     * This operation requires the keys/delete permission.
     *
     * Example usage:
     * ```ts
     * const client = new KeyClient(url, credentials);
     * await client.createKey("MyKey", "EC");
     * const poller = await client.beginDeleteKey("MyKey");
     *
     * // Serializing the poller
     * const serialized = poller.toString();
     * // A new poller can be created with:
     * // await client.beginDeleteKey("MyKey", { resumeFrom: serialized });
     *
     * // Waiting until it's done
     * const deletedKey = await poller.pollUntilDone();
     * console.log(deletedKey);
     * ```
     * Deletes a key from a specified key vault.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    async beginDeleteKey(name, options = {}) {
        const poller = new DeleteKeyPoller({
            name,
            vaultUrl: this.vaultUrl,
            client: this.client,
            intervalInMs: options.intervalInMs,
            resumeFrom: options.resumeFrom,
            operationOptions: options
        });
        // This will initialize the poller's operation (the deletion of the key).
        await poller.poll();
        return poller;
    }
    /**
     * The updateKeyProperties method changes specified properties of an existing stored key. Properties that
     * are not specified in the request are left unchanged. The value of a key itself cannot be
     * changed. This operation requires the keys/set permission.
     *
     * Example usage:
     * ```ts
     * let keyName = "MyKey";
     * let client = new KeyClient(url, credentials);
     * let key = await client.getKey(keyName);
     * let result = await client.updateKeyProperties(keyName, key.properties.version, { enabled: false });
     * ```
     * Updates the properties associated with a specified key in a given key vault.
     * @param name - The name of the key.
     * @param keyVersion - The version of the key.
     * @param options - The optional parameters.
     */
    updateKeyProperties(name, keyVersion, options = {}) {
        return withTrace(`updateKeyProperties`, options, async (updatedOptions) => {
            const { enabled, notBefore, expiresOn: expires } = updatedOptions, remainingOptions = __rest(updatedOptions, ["enabled", "notBefore", "expiresOn"]);
            const unflattenedOptions = Object.assign(Object.assign({}, remainingOptions), { keyAttributes: {
                    enabled,
                    notBefore,
                    expires
                } });
            const response = await this.client.updateKey(this.vaultUrl, name, keyVersion, unflattenedOptions);
            return getKeyFromKeyBundle(response);
        });
    }
    /**
     * The getKey method gets a specified key and is applicable to any key stored in Azure Key Vault.
     * This operation requires the keys/get permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let key = await client.getKey("MyKey");
     * ```
     * Get a specified key from a given key vault.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    getKey(name, options = {}) {
        return withTrace(`getKey`, options, async (updatedOptions) => {
            const response = await this.client.getKey(this.vaultUrl, name, options && options.version ? options.version : "", updatedOptions);
            return getKeyFromKeyBundle(response);
        });
    }
    /**
     * The getDeletedKey method returns the specified deleted key along with its properties.
     * This operation requires the keys/get permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let key = await client.getDeletedKey("MyDeletedKey");
     * ```
     * Gets the specified deleted key.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    getDeletedKey(name, options = {}) {
        return withTrace(`getDeletedKey`, options, async (updatedOptions) => {
            const response = await this.client.getDeletedKey(this.vaultUrl, name, updatedOptions);
            return getKeyFromKeyBundle(response);
        });
    }
    /**
     * The purge deleted key operation removes the key permanently, without the possibility of
     * recovery. This operation can only be enabled on a soft-delete enabled vault. This operation
     * requires the keys/purge permission.
     *
     * Example usage:
     * ```ts
     * const client = new KeyClient(url, credentials);
     * const deletePoller = await client.beginDeleteKey("MyKey")
     * await deletePoller.pollUntilDone();
     * await client.purgeDeletedKey("MyKey");
     * ```
     * Permanently deletes the specified key.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    purgeDeletedKey(name, options = {}) {
        return withTrace(`purgeDeletedKey`, options, async (updatedOptions) => {
            await this.client.purgeDeletedKey(this.vaultUrl, name, updatedOptions);
        });
    }
    /**
     * Recovers the deleted key in the specified vault. This operation can only be performed on a
     * soft-delete enabled vault.
     *
     * This function returns a Long Running Operation poller that allows you to wait indefinitely until the deleted key is recovered.
     *
     * This operation requires the keys/recover permission.
     *
     * Example usage:
     * ```ts
     * const client = new KeyClient(url, credentials);
     * await client.createKey("MyKey", "EC");
     * const deletePoller = await client.beginDeleteKey("MyKey");
     * await deletePoller.pollUntilDone();
     * const poller = await client.beginRecoverDeletedKey("MyKey");
     *
     * // Serializing the poller
     * const serialized = poller.toString();
     * // A new poller can be created with:
     * // await client.beginRecoverDeletedKey("MyKey", { resumeFrom: serialized });
     *
     * // Waiting until it's done
     * const key = await poller.pollUntilDone();
     * console.log(key);
     * ```
     * Recovers the deleted key to the latest version.
     * @param name - The name of the deleted key.
     * @param options - The optional parameters.
     */
    async beginRecoverDeletedKey(name, options = {}) {
        const poller = new RecoverDeletedKeyPoller({
            name,
            vaultUrl: this.vaultUrl,
            client: this.client,
            intervalInMs: options.intervalInMs,
            resumeFrom: options.resumeFrom,
            operationOptions: options
        });
        // This will initialize the poller's operation (the deletion of the key).
        await poller.poll();
        return poller;
    }
    /**
     * Requests that a backup of the specified key be downloaded to the client. All versions of the
     * key will be downloaded. This operation requires the keys/backup permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let backupContents = await client.backupKey("MyKey");
     * ```
     * Backs up the specified key.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    backupKey(name, options = {}) {
        return withTrace(`backupKey`, options, async (updatedOptions) => {
            const response = await this.client.backupKey(this.vaultUrl, name, updatedOptions);
            return response.value;
        });
    }
    /**
     * Restores a backed up key, and all its versions, to a vault. This operation requires the
     * keys/restore permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let backupContents = await client.backupKey("MyKey");
     * // ...
     * let key = await client.restoreKeyBackup(backupContents);
     * ```
     * Restores a backed up key to a vault.
     * @param backup - The backup blob associated with a key bundle.
     * @param options - The optional parameters.
     */
    async restoreKeyBackup(backup, options = {}) {
        return withTrace(`restoreKeyBackup`, options, async (updatedOptions) => {
            const response = await this.client.restoreKey(this.vaultUrl, backup, updatedOptions);
            return getKeyFromKeyBundle(response);
        });
    }
    /**
     * @internal
     * @hidden
     * Deals with the pagination of {@link listPropertiesOfKeyVersions}.
     * @param name - The name of the Key Vault Key.
     * @param continuationState - An object that indicates the position of the paginated request.
     * @param options - Common options for the iterative endpoints.
     */
    listPropertiesOfKeyVersionsPage(name, continuationState, options) {
        return __asyncGenerator(this, arguments, function* listPropertiesOfKeyVersionsPage_1() {
            if (continuationState.continuationToken == null) {
                const optionsComplete = Object.assign({ maxresults: continuationState.maxPageSize }, options);
                const currentSetResponse = yield __await(withTrace("listPropertiesOfKeyVersionsPage", optionsComplete, async (updatedOptions) => this.client.getKeyVersions(this.vaultUrl, name, updatedOptions)));
                continuationState.continuationToken = currentSetResponse.nextLink;
                if (currentSetResponse.value) {
                    yield yield __await(currentSetResponse.value.map(getKeyPropertiesFromKeyItem, this));
                }
            }
            while (continuationState.continuationToken) {
                const currentSetResponse = yield __await(withTrace("listPropertiesOfKeyVersionsPage", options || {}, async (updatedOptions) => this.client.getKeyVersions(continuationState.continuationToken, name, updatedOptions)));
                continuationState.continuationToken = currentSetResponse.nextLink;
                if (currentSetResponse.value) {
                    yield yield __await(currentSetResponse.value.map(getKeyPropertiesFromKeyItem, this));
                }
                else {
                    break;
                }
            }
        });
    }
    /**
     * @internal
     * @hidden
     * Deals with the iteration of all the available results of {@link listPropertiesOfKeyVersions}.
     * @param name - The name of the Key Vault Key.
     * @param options - Common options for the iterative endpoints.
     */
    listPropertiesOfKeyVersionsAll(name, options) {
        return __asyncGenerator(this, arguments, function* listPropertiesOfKeyVersionsAll_1() {
            var e_1, _a;
            const f = {};
            try {
                for (var _b = __asyncValues(this.listPropertiesOfKeyVersionsPage(name, f, options)), _c; _c = yield __await(_b.next()), !_c.done;) {
                    const page = _c.value;
                    for (const item of page) {
                        yield yield __await(item);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    /**
     * Iterates all versions of the given key in the vault. The full key identifier, properties, and tags are provided
     * in the response. This operation requires the keys/list permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * for await (const keyProperties of client.listPropertiesOfKeyVersions("MyKey")) {
     *   const key = await client.getKey(keyProperties.name);
     *   console.log("key version: ", key);
     * }
     * ```
     * @param name - Name of the key to fetch versions for
     * @param options - The optional parameters.
     */
    listPropertiesOfKeyVersions(name, options = {}) {
        const iter = this.listPropertiesOfKeyVersionsAll(name, options);
        return {
            next() {
                return iter.next();
            },
            [Symbol.asyncIterator]() {
                return this;
            },
            byPage: (settings = {}) => this.listPropertiesOfKeyVersionsPage(name, settings, options)
        };
    }
    /**
     * @internal
     * @hidden
     * Deals with the pagination of {@link listPropertiesOfKeys}.
     * @param continuationState - An object that indicates the position of the paginated request.
     * @param options - Common options for the iterative endpoints.
     */
    listPropertiesOfKeysPage(continuationState, options) {
        return __asyncGenerator(this, arguments, function* listPropertiesOfKeysPage_1() {
            if (continuationState.continuationToken == null) {
                const optionsComplete = Object.assign({ maxresults: continuationState.maxPageSize }, options);
                const currentSetResponse = yield __await(withTrace("listPropertiesOfKeysPage", optionsComplete, async (updatedOptions) => this.client.getKeys(this.vaultUrl, updatedOptions)));
                continuationState.continuationToken = currentSetResponse.nextLink;
                if (currentSetResponse.value) {
                    yield yield __await(currentSetResponse.value.map(getKeyPropertiesFromKeyItem, this));
                }
            }
            while (continuationState.continuationToken) {
                const currentSetResponse = yield __await(withTrace("KeysClient.listPropertiesOfKeysPage", options || {}, async (updatedOptions) => this.client.getKeys(continuationState.continuationToken, updatedOptions)));
                continuationState.continuationToken = currentSetResponse.nextLink;
                if (currentSetResponse.value) {
                    yield yield __await(currentSetResponse.value.map(getKeyPropertiesFromKeyItem, this));
                }
                else {
                    break;
                }
            }
        });
    }
    /**
     * @internal
     * @hidden
     * Deals with the iteration of all the available results of {@link listPropertiesOfKeys}.
     * @param options - Common options for the iterative endpoints.
     */
    listPropertiesOfKeysAll(options) {
        return __asyncGenerator(this, arguments, function* listPropertiesOfKeysAll_1() {
            var e_2, _a;
            const f = {};
            try {
                for (var _b = __asyncValues(this.listPropertiesOfKeysPage(f, options)), _c; _c = yield __await(_b.next()), !_c.done;) {
                    const page = _c.value;
                    for (const item of page) {
                        yield yield __await(item);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
    }
    /**
     * Iterates the latest version of all keys in the vault.  The full key identifier and properties are provided
     * in the response. No values are returned for the keys. This operations requires the keys/list permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * for await (const keyProperties of client.listPropertiesOfKeys()) {
     *   const key = await client.getKey(keyProperties.name);
     *   console.log("key: ", key);
     * }
     * ```
     * List all keys in the vault
     * @param options - The optional parameters.
     */
    listPropertiesOfKeys(options = {}) {
        const iter = this.listPropertiesOfKeysAll(options);
        return {
            next() {
                return iter.next();
            },
            [Symbol.asyncIterator]() {
                return this;
            },
            byPage: (settings = {}) => this.listPropertiesOfKeysPage(settings, options)
        };
    }
    /**
     * @internal
     * @hidden
     * Deals with the pagination of {@link listDeletedKeys}.
     * @param continuationState - An object that indicates the position of the paginated request.
     * @param options - Common options for the iterative endpoints.
     */
    listDeletedKeysPage(continuationState, options) {
        return __asyncGenerator(this, arguments, function* listDeletedKeysPage_1() {
            if (continuationState.continuationToken == null) {
                const optionsComplete = Object.assign({ maxresults: continuationState.maxPageSize }, options);
                const currentSetResponse = yield __await(withTrace("listDeletedKeysPage", optionsComplete, async (updatedOptions) => this.client.getDeletedKeys(this.vaultUrl, updatedOptions)));
                continuationState.continuationToken = currentSetResponse.nextLink;
                if (currentSetResponse.value) {
                    yield yield __await(currentSetResponse.value.map(getDeletedKeyFromDeletedKeyItem, this));
                }
            }
            while (continuationState.continuationToken) {
                const currentSetResponse = yield __await(withTrace("listDeletedKeysPage", options || {}, async (updatedOptions) => this.client.getDeletedKeys(continuationState.continuationToken, updatedOptions)));
                continuationState.continuationToken = currentSetResponse.nextLink;
                if (currentSetResponse.value) {
                    yield yield __await(currentSetResponse.value.map(getDeletedKeyFromDeletedKeyItem, this));
                }
                else {
                    break;
                }
            }
        });
    }
    /**
     * @internal
     * @hidden
     * Deals with the iteration of all the available results of {@link listDeletedKeys}.
     * @param options - Common options for the iterative endpoints.
     */
    listDeletedKeysAll(options) {
        return __asyncGenerator(this, arguments, function* listDeletedKeysAll_1() {
            var e_3, _a;
            const f = {};
            try {
                for (var _b = __asyncValues(this.listDeletedKeysPage(f, options)), _c; _c = yield __await(_b.next()), !_c.done;) {
                    const page = _c.value;
                    for (const item of page) {
                        yield yield __await(item);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
                }
                finally { if (e_3) throw e_3.error; }
            }
        });
    }
    /**
     * Iterates the deleted keys in the vault.  The full key identifier and properties are provided
     * in the response. No values are returned for the keys. This operations requires the keys/list permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * for await (const deletedKey of client.listDeletedKeys()) {
     *   console.log("deleted key: ", deletedKey);
     * }
     * ```
     * List all keys in the vault
     * @param options - The optional parameters.
     */
    listDeletedKeys(options = {}) {
        const iter = this.listDeletedKeysAll(options);
        return {
            next() {
                return iter.next();
            },
            [Symbol.asyncIterator]() {
                return this;
            },
            byPage: (settings = {}) => this.listDeletedKeysPage(settings, options)
        };
    }
}
//# sourceMappingURL=index.js.map