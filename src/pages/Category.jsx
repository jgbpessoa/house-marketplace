import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [totalListings, setTotalListings] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const fetchLimit = 5;

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingRef = collection(db, "listings");

        // Create a query to get total number of listings
        const qTotal = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc")
        );

        // Execute query
        const querySnapTotal = await getDocs(qTotal);
        querySnapTotal.size > fetchLimit && setLoadMore(true);
        setTotalListings(querySnapTotal.size);

        // Create a query to load listings
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(fetchLimit)
        );

        // Execute query
        const querySnap = await getDocs(q);

        // Get last rendered listing
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listingsArr = [];
        querySnap.forEach((doc) => {
          return listingsArr.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listingsArr);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    };

    fetchListings();
  }, [params.categoryName]);

  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingRef = collection(db, "listings");

      // Create a query
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(fetchLimit)
      );

      // Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listingsArr = [];
      querySnap.forEach((doc) => {
        return listingsArr.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      totalListings > listings.length + listingsArr.length
        ? setLoadMore(true)
        : setLoadMore(false);
      setListings([...listings, ...listingsArr]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          {loadMore && (
            <p className="loadMore" onClick={() => onFetchMoreListings()}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
