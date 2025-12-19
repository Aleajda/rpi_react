import { FullOffer, OffersList } from "../../types/offer"
import FavoritesCard from "../favorites-card/favorites-card";


type FavoritesCardListProps = {
    offersList: FullOffer[];
}

function FavoritesCardList({ offersList }: FavoritesCardListProps) {
    return (
        <div className="favorites__places">
            {offersList
                .filter((item) => item.isFavorite)   // ← оставляем только избранные
                .map((item) => (
                    <FavoritesCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        type={item.type}
                        price={item.price}
                        previewImage={item.images[1]}
                        isPremium={item.isPremium}
                        rating={item.rating}
                        isFavorite={item.isFavorite}
                    />
                ))}
        </div>
    );
}


export { FavoritesCardList };