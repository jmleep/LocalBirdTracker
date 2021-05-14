export const fetchRecentObservationsForType = async (type, regionCode) => {
    const response = await fetch(
        `https://api.ebird.org/v2/data/obs/${regionCode}/recent/${type}`,
        {
            headers: {
                "x-ebirdapitoken": "uq92puu4sujh",
            },
        }
    );

    const json = await response.json();
    return json;
}