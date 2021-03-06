/**
 * Copyright 2017-2021 Sourcepole AG
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    IDENTIFY_EMPTY,
    IDENTIFY_RESPONSE,
    IDENTIFY_REQUEST,
    SET_IDENTIFY_TOOL,
    PURGE_IDENTIFY_RESULTS,
    SET_IDENTIFY_FEATURE_RESULT
} from '../actions/identify';

const defaultState = {
    tool: null
};

export default function identify(state = defaultState, action) {
    switch (action.type) {
    case SET_IDENTIFY_TOOL: {
        return {...state, tool: action.tool};
    }
    case PURGE_IDENTIFY_RESULTS: {
        return {
            ...state,
            responses: [],
            requests: []
        };
    }
    case IDENTIFY_REQUEST: {
        const {reqId, request} = action;
        const requests = state.requests || [];
        return {
            ...state,
            requests: [...requests, {reqId, request}]
        };
    }
    case IDENTIFY_RESPONSE: {
        const {reqId, request, data, responseType, error} = action;
        const responses = state.responses || [];
        return {
            ...state,
            responses: [...responses, {reqId, request, data, responseType, error}]
        };
    }
    case IDENTIFY_EMPTY: {
        return {
            ...state,
            requests: [{reqId: action.reqId, request: null}],
            responses: [{reqId: action.reqId, request: null, data: null}]
        };
    }
    case SET_IDENTIFY_FEATURE_RESULT: {
        const request = {
            metadata: {layer: action.layername, pos: action.pos}
        };
        const data = {
            type: "FeatureCollection",
            features: [
                // See IdentifyUtils.parseGeoJSONResponse
                {...action.feature, id: action.layername + "." + action.feature.id}
            ]
        };
        return {
            ...state,
            requests: [...(state.requests || []), {reqId: action.reqId, request}],
            responses: [...(state.responses || []), {reqId: action.reqId, request, data: data, responseType: 'application/json'}]
        };
    }
    default:
        return state;
    }
}
