interface IRecordInList {
    id: string;
    name: string;
    type: recordType;
    yearOfRelease: number;
    mainDirector: string;
    starring: { actorName: string }[];
    genres: { genre: string }[];
    rating: IRating;
}

type recordType = 'movie'|'series';

interface IRecord extends IRecordInList {
    description: string;
}

interface IRecordDictionary {
    [id: string]: IRecord;
}

interface IRating {
    dateOfWatching: string;
    seenItWhole: boolean;
    score: number;
}

interface IMovie extends IRecord {}

interface ISeries extends IRecord {
    seasons: ISeriesSeason[];
}

interface ISeriesSeason {
    number: number;
    episodes: IEpisode[];
}

interface IEpisode {
    episodeName: string;
    rating: IRating;
}