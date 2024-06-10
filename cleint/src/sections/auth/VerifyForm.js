import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Stack, Button } from "@mui/material";
// components
import FormProvider from "../../components/hook-form";
import RHFCodes from "../../components/hook-form/RHFCodes";
import { useDispatch, useSelector } from "react-redux";
import { VerifyEmail } from "../../redux/slices/auth";
import { Navigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ----------------------------------------------------------------------

export default function VerifyForm() {
    const dispatch = useDispatch();
    const { email } = useSelector((state) => state.auth);
    const [queryParameters] = useSearchParams();
    const otp = queryParameters.get('otp')
    //  console.log(+otp.split("")[0]); //bunu normalde mailden gelir maile baxib yazrg falan... Ama bizde mail calismadi Manuel yapdm 
    const navigate = useNavigate();
    const VerifyCodeSchema = Yup.object().shape({
        code1: Yup.string().required("Code is required"),
        code2: Yup.string().required("Code is required"),
        code3: Yup.string().required("Code is required"),
        code4: Yup.string().required("Code is required"),
        code5: Yup.string().required("Code is required"),
        code6: Yup.string().required("Code is required"),
    });

    const defaultValues = {
        code1: otp.split("")[0],
        code2: otp.split("")[1],
        code3: otp.split("")[2],
        code4: otp.split("")[3],
        code5: otp.split("")[4],
        code6: otp.split("")[5],
    };

    const methods = useForm({
        mode: "onChange",
        resolver: yupResolver(VerifyCodeSchema),
        defaultValues,
    });
    const [redirect, setRedirect] = useState(false)
    const { handleSubmit, } = methods;

    const onSubmit = async (data) => {
        const otp = `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}${data.code6}`
        try {
            //   Send API Request
            dispatch(VerifyEmail({ email, otp, }, responseCallback));
        } catch (error) {
            console.error(error);
        }

    };
    const responseCallback = (response) => {
        if (response.data.status === "success") {
            setRedirect(true);
        }

    }


    useEffect(() => {
        if (redirect) {
            setRedirect(false)
            navigate('/auth/login');
        }
    }, [redirect, navigate]);
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <RHFCodes keyName="code" inputs={["code1", "code2", "code3", "code4", "code5", "code6"]} />

                <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{
                        mt: 3,
                        bgcolor: "text.primary",
                        color: (theme) =>
                            theme.palette.mode === "light" ? "common.white" : "grey.800",
                        "&:hover": {
                            bgcolor: "text.primary",
                            color: (theme) =>
                                theme.palette.mode === "light" ? "common.white" : "grey.800",
                        },
                    }}
                >
                    Verify
                </Button>
            </Stack>
        </FormProvider>
    );
}