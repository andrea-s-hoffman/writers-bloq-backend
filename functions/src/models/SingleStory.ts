interface CommentModel {
    cm_author: string,
    cm_displayName: string,
    comment: string,
    date: string
}
// testing

export default interface SingleStory {
    uid?: string;
    author?: string;
    title: string;
    date: string;
    dateNum: number;
    story: string;
    favorite: boolean;
    upvotes: number;
    comments?: CommentModel[];
    public: boolean;
    displayName?: string;
}