import {Form, Formik} from "formik";
import Button from "@mui/material/Button";
import {Search} from "@mui/icons-material";
import CustomField from "../../component/CustomField.tsx";

const UserFilter = () => {
    return (
        <>
            <Formik
                onSubmit={userService.getPage}
                initialValues={{
                    search: null,
                    pageIndex: 1,
                    pageSize: 25
                }}>
                {({errors, touched, handleChange, handleBlur}) => (
                    <Form>
                        <div className="flex flex-col gap-6">
                            {/* Grid for Input Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Keyword Search Field */}
                                <div>
                                    <CustomField
                                        size={'small'}
                                        name={'search'}
                                        label="User name"
                                        touched={touched}
                                        errors={errors}
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<Search />}
                                    className="w-full sm:w-auto px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}
export default UserFilter