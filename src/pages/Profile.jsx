import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import {
  updateDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";

function Profile() {
  const auth = getAuth();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const listingRef = collection(db, "listings");

        const q = query(
          listingRef,
          where("userRef", "==", auth.currentUser.uid),
          orderBy("timestamp", "desc")
        );

        const docSnap = await getDocs(q);

        const listingsArr = [];

        docSnap.forEach((doc) => {
          return listingsArr.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listingsArr);
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      // Update display name in Firebase
      auth.currentUser.displayName !== name &&
        (await updateProfile(auth.currentUser, {
          displayName: name,
        }));

      // Update email in Firebase
      auth.currentUser.email !== email &&
        (await updateEmail(auth.currentUser, email));

      // Update in Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
        email,
      });
      toast.success("Profile Updated");
    } catch (error) {
      toast.error("Could not update Profile");
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const docRef = doc(db, "listings", listingId);

      await deleteDoc(docRef);
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Successfully deleted listing");
    }
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails(!changeDetails);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
      </main>

      {!loading && listings?.length > 0 && (
        <>
          <p className="listingText">Your Listings</p>
          <ul className="listingsList">
            {listings.map((listing) => (
              <ListingItem
                listing={listing.data}
                id={listing.id}
                key={listing.id}
                onDelete={() => onDelete(listing.id)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Profile;
