export type StringTMap<T> = { [key: string]: T }

export type Translation = StringTMap<string | StringTMap<string>>
export type Translations = StringTMap<Translation>
