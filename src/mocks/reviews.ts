import { Review } from "../types/reviews";

const reviews: Review[] = [
    {
        'id': 'user-001',
        user: {
            name: "Alexey",
            avatarUrl:"/img/avatar-max.jpg",
            isPro: false
        },
        rating: 4,
        comment: "A quiet cozy and picturesque that hides behind a river.",
        date: "2019-04-24"
    },
]

export { reviews };