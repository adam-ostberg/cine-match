export type ModelType = {
    userId: number;
    genres: [];
    likes: [];
    dislikes: [];
    setId: (id: number) => void;
}

export const model: ModelType = {
    userId: 0,
    genres: [],
    likes: [],
    dislikes: [],

    setId(id: number) {
        this.userId = id;
    } 
}