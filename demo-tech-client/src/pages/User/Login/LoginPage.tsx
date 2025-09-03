import { Button, CircularProgress, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import type { FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom";
import {login} from "../user-service.ts";
import {useAuth} from "../../../context/AuthContext.tsx";

interface LoginFormValues {
    username: string;
    password: string;
}

const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Vui lòng nhập tài khoản"),
    password: Yup.string().required("Vui lòng nhập mật khẩu"),
})

export default function LoginPage() {
    const { login: authLogin } = useAuth(); // gọi hook trong component

    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
            <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl border border-gray-200">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Đăng nhập
                </h1>

                <Formik
                    initialValues={{ username: "", password: "" }}
                    validationSchema={LoginSchema}
                    onSubmit={async (
                        values: LoginFormValues,
                        { setSubmitting }: FormikHelpers<LoginFormValues>
                    ) => {
                        try {
                            toast.success("Đăng nhập thành công!");
                            const data = await login(values)
                            authLogin(data.token); // ✅ cập nhật context và localStorage

                            navigate("/dashboard");
                        } catch (err: any) {
                            toast.error("Sai tài khoản hoặc mật khẩu!");
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {(formik: FormikProps<LoginFormValues>) => {
                        return (
                            <Form className="flex flex-col gap-4">
                                <TextField
                                    label="Tài khoản"
                                    name="username"
                                    variant="outlined"
                                    fullWidth
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
                                />
                                <TextField
                                    label="Mật khẩu"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={formik.isSubmitting}
                                    sx={{
                                        py: 1.5,
                                        fontWeight: "bold",
                                        background: "linear-gradient(to right, #7F00FF, #E100FF)",
                                        color: "#fff",
                                        "&:hover": {
                                            background: "linear-gradient(to right, #E100FF, #7F00FF)",
                                        },
                                    }}
                                >
                                    {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Đăng nhập"}
                                </Button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
}
