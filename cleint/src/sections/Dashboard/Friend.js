import React, { useEffect } from "react";
import { Dialog, DialogContent, Slide, Stack, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import {FetchFriendRequests,FetchFriends,FetchUsers,} from "../../redux/slices/app";
import { FriendElement, FriendRequestElement, UserElement } from "../../components/UserElement";
import { FetchFriendRequests, FetchFriends, FetchUsers } from "../../redux/slices/app";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const UsersList = () => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.app);
    useEffect(() => { dispatch(FetchUsers()) }, [dispatch]);
    return <> {users?.map((el, idx) => <UserElement key={idx} {...el} />)}</>
};

const FriendsList = ({handleClose}) => {
    const dispatch = useDispatch();
    const { friends } = useSelector((state) => state.app);
    console.log({ friends });

    useEffect(() => { dispatch(FetchFriends()) }, [dispatch]);
    return <>{friends?.map((el, idx) => <FriendElement key={idx} {...el} handleClose={handleClose} />)}  </>
};

const RequestsList = () => {
    const dispatch = useDispatch();
    const { friendRequests } = useSelector((state) => state.app);
    useEffect(() => { dispatch(FetchFriendRequests()) }, [dispatch])
    return <>{friendRequests?.map((el, idx) => <FriendRequestElement key={idx} {...el.sender} id={el._id} />)}</>
};

const Friends = ({ open, handleClose }) => {
    const [value, setValue] = React.useState(0);
    const handleChange = (_event, newValue) => setValue(newValue);
    return (
        <Dialog fullWidth maxWidth="xs" open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description" sx={{ p: 4 }}   >
            <Stack p={2} sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab label="Explore" />
                    <Tab label="Friends" />
                    <Tab label="Requests" />
                </Tabs>
            </Stack>
            <DialogContent>
                <Stack sx={{ height: "100%" }}>
                    <Stack spacing={2.4}>
                        {(() => {
                            switch (value) {
                                case 0: return <UsersList />;
                                case 1: return <FriendsList handleClose={handleClose} />;
                                case 2: return <RequestsList />;
                                default: break;
                            }
                        })()}
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default Friends;