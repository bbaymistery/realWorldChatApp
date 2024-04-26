import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// components
import FormProvider, { RHFTextField } from "../../components/hook-form";
import { useDispatch, useSelector } from "react-redux";
// import { ForgotPassword } from "../../redux/slices/auth";
import { LoadingButton } from "@mui/lab";
import { ForgotPassword } from "../../redux/slices/auth";
import { useState } from "react";
import { Navigate } from "react-router-dom";

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
    const { isLoading, } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [redirectUrl, setRedirectUrl] = useState(null);
    const ResetPasswordSchema = Yup.object().shape({
        email: Yup.string().required("Email is required")
            .email("Email must be a valid email address"),
    });

    const methods = useForm({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues: { email: "demo@tawk.com" },
    });

    const { handleSubmit } = methods;

    const onSubmit = async (data) => {
        try {
            //   Send API Request
            dispatch(ForgotPassword(data, responseCallback));
        } catch (error) {
            console.error(error);
        }
    };

    const responseCallback = (response) => {
        console.log({ response, where: "responseCallback" });
        if (response.data.status === "success") {
            setRedirectUrl(response.data.resetUrl_2);
        }

    }
    if (redirectUrl) {
        return <Navigate to={redirectUrl} replace />;
    }
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <RHFTextField name="email" label="Email address" />
            <LoadingButton
                loading={isLoading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{
                    mt: 3,
                    bgcolor: "text.primary",
                    color: (theme) => theme.palette.mode === "light" ? "common.white" : "grey.800",
                    "&:hover": {
                        bgcolor: "text.primary",
                        color: (theme) => theme.palette.mode === "light" ? "common.white" : "grey.800",
                    },
                }}
            >
                Send Request
            </LoadingButton>
        </FormProvider>
    );
}