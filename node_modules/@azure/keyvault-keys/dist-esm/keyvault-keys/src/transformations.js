// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { parseKeyVaultKeyIdentifier } from "./identifier";
/**
 * @internal
 * Shapes the exposed {@link KeyVaultKey} based on either a received key bundle or deleted key bundle.
 */
export function getKeyFromKeyBundle(bundle) {
    const keyBundle = bundle;
    const deletedKeyBundle = bundle;
    const parsedId = parseKeyVaultKeyIdentifier(keyBundle.key.kid);
    const attributes = keyBundle.attributes || {};
    delete keyBundle.attributes;
    const resultObject = {
        key: keyBundle.key,
        id: keyBundle.key ? keyBundle.key.kid : undefined,
        name: parsedId.name,
        keyOperations: keyBundle.key ? keyBundle.key.keyOps : undefined,
        keyType: keyBundle.key ? keyBundle.key.kty : undefined,
        properties: {
            tags: keyBundle.tags,
            enabled: attributes.enabled,
            notBefore: attributes.notBefore,
            expiresOn: attributes.expires,
            createdOn: attributes.created,
            updatedOn: attributes.updated,
            recoverableDays: attributes.recoverableDays,
            recoveryLevel: attributes.recoveryLevel,
            vaultUrl: parsedId.vaultUrl,
            version: parsedId.version,
            name: parsedId.name,
            managed: keyBundle.managed,
            id: keyBundle.key ? keyBundle.key.kid : undefined
        }
    };
    if (deletedKeyBundle.recoveryId) {
        resultObject.properties.recoveryId = deletedKeyBundle.recoveryId;
        resultObject.properties.scheduledPurgeDate = deletedKeyBundle.scheduledPurgeDate;
        resultObject.properties.deletedOn = deletedKeyBundle.deletedDate;
    }
    return resultObject;
}
/**
 * @internal
 * Shapes the exposed {@link DeletedKey} based on a received KeyItem.
 */
export function getDeletedKeyFromDeletedKeyItem(keyItem) {
    const commonProperties = getKeyPropertiesFromKeyItem(keyItem);
    return {
        key: {
            kid: keyItem.kid
        },
        id: keyItem.kid,
        name: commonProperties.name,
        properties: Object.assign(Object.assign({}, commonProperties), { recoveryId: keyItem.recoveryId, scheduledPurgeDate: keyItem.scheduledPurgeDate, deletedOn: keyItem.deletedDate })
    };
}
/**
 * @internal
 * Shapes the exposed {@link KeyProperties} based on a received KeyItem.
 */
export function getKeyPropertiesFromKeyItem(keyItem) {
    const parsedId = parseKeyVaultKeyIdentifier(keyItem.kid);
    const attributes = keyItem.attributes || {};
    const resultObject = {
        createdOn: attributes.created,
        enabled: attributes === null || attributes === void 0 ? void 0 : attributes.enabled,
        expiresOn: attributes === null || attributes === void 0 ? void 0 : attributes.expires,
        id: keyItem.kid,
        managed: keyItem.managed,
        name: parsedId.name,
        notBefore: attributes === null || attributes === void 0 ? void 0 : attributes.notBefore,
        recoverableDays: attributes === null || attributes === void 0 ? void 0 : attributes.recoverableDays,
        recoveryLevel: attributes === null || attributes === void 0 ? void 0 : attributes.recoveryLevel,
        tags: keyItem.tags,
        updatedOn: attributes.updated,
        vaultUrl: parsedId.vaultUrl,
        version: parsedId.version
    };
    return resultObject;
}
//# sourceMappingURL=transformations.js.map