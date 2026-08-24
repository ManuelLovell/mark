import { Metadata } from "@owlbear-rodeo/sdk";
import { Constants } from "./constants";

type CompactGroup = {
    n: string;
    m: string;
    i?: string;
    c?: string;
    ts?: string;
    bo?: string;
    os?: string;
};

type CompactLabel = {
    i: string;
    n: string;
    d: string;
    c: string;
    a: number;
    g: string;
    k: number;
};

type CompactSaveData = {
    g: CompactGroup[];
    l: CompactLabel[];
    d: string;
    o: string;
    s: string;
};

type LegacyMetaContainer = {
    saveData?: ISaveData;
};

type CompactMetaContainer = {
    s?: CompactSaveData;
};

const LEGACY_METADATA_KEY = `${Constants.EXTENSIONID}/metadata_marks`;
const COMPACT_METADATA_KEY = `${Constants.EXTENSIONID}/m`;

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function decodeCompactSaveData(input: CompactSaveData): ISaveData {
    return {
        Groups: (input.g || []).map((group) => ({
            Num: group.n,
            Name: group.m,
            Icon: group.i,
            IconColor: group.c,
            TextSizeOverride: group.ts,
            BgOpacityOverride: group.bo,
            OutlineStrokeOverride: group.os,
        })),
        Labels: (input.l || []).map((label) => ({
            Id: label.i,
            Name: label.n,
            Direction: label.d,
            Color: label.c,
            Active: label.a,
            Group: label.g,
            Counter: label.k,
        })),
        Distance: input.d,
        Opacity: input.o,
        Stroke: input.s,
    };
}

function encodeCompactSaveData(saveData: ISaveData): CompactSaveData {
    return {
        g: (saveData.Groups || []).map((group) => ({
            n: group.Num,
            m: group.Name,
            i: group.Icon,
            c: group.IconColor,
            ts: group.TextSizeOverride,
            bo: group.BgOpacityOverride,
            os: group.OutlineStrokeOverride,
        })),
        l: (saveData.Labels || []).map((label) => ({
            i: label.Id,
            n: label.Name,
            d: label.Direction,
            c: label.Color,
            a: label.Active,
            g: label.Group,
            k: label.Counter,
        })),
        d: saveData.Distance,
        o: saveData.Opacity,
        s: saveData.Stroke,
    };
}

export function buildRoomMetadataPatch(saveData: ISaveData): Metadata {
    const patch: Metadata = {};
    // Explicitly clear the legacy payload so we do not store both large and compact blobs.
    patch[LEGACY_METADATA_KEY] = null;
    patch[COMPACT_METADATA_KEY] = { s: encodeCompactSaveData(saveData) };
    return patch;
}

export function readSaveDataFromRoomMetadata(roomMetadata: Record<string, unknown>): ISaveData | undefined {
    const compactRaw = roomMetadata[COMPACT_METADATA_KEY];
    if (isObject(compactRaw)) {
        const compactContainer = compactRaw as CompactMetaContainer;
        if (compactContainer.s && isObject(compactContainer.s)) {
            return decodeCompactSaveData(compactContainer.s);
        }
    }

    const legacyRaw = roomMetadata[LEGACY_METADATA_KEY];
    if (!isObject(legacyRaw)) return undefined;

    const legacyContainer = legacyRaw as LegacyMetaContainer;
    const legacySaveData = legacyContainer.saveData;
    if (legacySaveData && isObject(legacySaveData)) {
        return legacySaveData;
    }

    const compactContainer = legacyRaw as CompactMetaContainer;
    if (compactContainer.s && isObject(compactContainer.s)) {
        return decodeCompactSaveData(compactContainer.s);
    }

    return undefined;
}
