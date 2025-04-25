import * as React from 'react';
import { Field, FieldProps, getIn } from 'formik';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from "@mui/material/TextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Radio, FormControlLabel, RadioGroup, Checkbox, FormControlLabel as MuiFormControlLabel } from "@mui/material";
import { isAfter } from "date-fns";
import { TYPE_FIELD } from "../helper/constant.ts";

interface Option {
    value: string;
    label: string;
}

interface Option {
    value: string;
    label: string;
}

interface CustomFieldProps {
    name: string;
    label?: string;
    touched?: Record<string, boolean>;
    errors?: Record<string, string>;
    required?: boolean;
    type?: string;
    options?: Option[];
    className?: string;
    onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CustomField: React.FC<CustomFieldProps> = ({ name, label, touched, errors, required = false, type = TYPE_FIELD.INPUT, options = [], ...props }) => {
    const today = new Date();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Field name={name}>
            {({ field, form: { setFieldValue, handleChange, touched, errors } }: FieldProps) => {
                const fieldValue = field.value === "null" ? null : field.value;
                const errorText = getIn(errors, name) as string | undefined;
                const isTouched = getIn(touched, name) as boolean | undefined;

                return (
                    <div className={`flex flex-col ${props.className}`}>
                        {type !== TYPE_FIELD.CHECKBOX && (
                            <label
                                htmlFor={name}
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    alignSelf: "flex-start",
                                    color: isTouched && errorText ? "hsl(0, 90%, 40%)" : "black",
                                }}
                            >
                                {label} {required && <span style={{ color: "red" }}>*</span>}
                            </label>
                        )}

                        {type === TYPE_FIELD.DATE ? (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={fieldValue || null}
                                    onChange={(value) => {
                                        if (value && isAfter(value, today)) {
                                            setFieldValue(name, today);
                                        } else {
                                            setFieldValue(name, value || null);
                                        }
                                    }}
                                    format="yyyy-MM-dd"
                                    shouldDisableDate={(date) => isAfter(date, today)}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                            variant: "outlined",
                                            error: isTouched && Boolean(errorText),
                                            helperText: isTouched && errorText,
                                            id: name,
                                            autoComplete: `current-${name}`,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        ) : type === TYPE_FIELD.INPUT_SEARCH ? (
                            <div className={`flex flex-col ${props.className}`}>
                                <TextField
                                    sx={{ ml: 1, flex: 1, fontSize: "0.875rem" }}
                                    placeholder={label || "Search..."}
                                    inputProps={{ "aria-label": label || "Search..." }}
                                    {...field}
                                    value={fieldValue || ""}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton type="submit" sx={{ p: "6px" }} aria-label="search">
                                                <SearchIcon sx={{ fontSize: "1.2rem" }} />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </div>
                        ) : type === TYPE_FIELD.RADIO ? (
                            <RadioGroup {...field} name={name} value={fieldValue || ""} onChange={handleChange} row>
                                {options.map((option) => (
                                    <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
                                ))}
                            </RadioGroup>
                        ) : type === TYPE_FIELD.CHECKBOX ? (
                            <MuiFormControlLabel
                                sx={{ width: "fit-content" }}
                                control={
                                    <Checkbox
                                        {...field}
                                        name={name}
                                        checked={Boolean(fieldValue)}
                                        onChange={handleChange}
                                        color="primary"
                                    />
                                }
                                label={label}
                            />
                        ) : (
                            <TextField
                                {...field}
                                type={type === TYPE_FIELD.PASSWORD ? (showPassword ? TYPE_FIELD.INPUT : TYPE_FIELD.PASSWORD) : type}
                                size="small"
                                value={fieldValue || ""}
                                id={name}
                                autoComplete={`current-${name}`}
                                error={isTouched && Boolean(errorText)}
                                helperText={isTouched && errorText}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    endAdornment:
                                        type === TYPE_FIELD.PASSWORD ? (
                                            <IconButton onClick={togglePasswordVisibility} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        ) : null,
                                }}
                                {...props}
                            />
                        )}
                    </div>
                );
            }}
        </Field>
    );
};

export default CustomField;
