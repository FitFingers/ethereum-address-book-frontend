import { makeStyles, Box, Button, TextField } from "@material-ui/core";
import * as yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import useModal from "components/modal/context";

// ===================================================
// UTIL
// ===================================================

// Error messages
const msg = {
  fill: "Please fill out this field",
  req: "This field is required",
};

// Form validation
const validationSchemas = {
  addContact: yup.object({
    name: yup.string(msg.fill).required(msg.req),
    address: yup.string(msg.fill).required(msg.req),
  }),
  payContact: yup.object({
    amount: yup.string(msg.fill).matches(/^\d+$/).required(msg.req),
  }),
};

// TODO: remove defaults
const rand = Math.random();

// Form field labels and init values
const formFields = {
  addContact: {
    name: {
      initial: rand > 0.49 ? "Jenna" : "Jimmy", // "",
    },
    address: {
      initial:
        rand > 0.49
          ? "0x64252f36b734b82549042895e39e9c9C9265Db13"
          : "0xe681B4AE322c131178e339AA77427D61509Db891", // "", // TODO: remove defaults!
      helper: "Please ensure this uses the correct network!",
    },
  },
  payContact: {
    wei: {
      initial: "",
      helper: "The value to send in wei",
    },
    // gwei: {
    //   initial: "",
    // },
    // eth: {
    //   initial: "",
    // }
  },
};

function createInitialValues(type) {
  return Object.entries(formFields[type]).reduce(
    (acc, [name, field]) => ({
      ...acc,
      [name]: field.initial,
    }),
    {}
  );
}

function formatLabel(str = "") {
  return str
    .replace(/[A-Z]/g, (c) => ` ${c}`)
    .replace(/^\w/, (c) => c.toUpperCase());
}

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  // formContainer: {},
  field: {
    padding: theme.spacing(1),
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function Form({ type = "addContact" }) {
  const classes = useStyles();
  const { submitCallback } = useModal();

  const { validationSchema, initialValues } = useMemo(
    () => ({
      validationSchema: validationSchemas[type],
      initialValues: createInitialValues(type),
    }),
    [type]
  );

  const { handleSubmit, values, handleChange, touched, errors } = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: submitCallback,
  });

  return (
    <Box className={classes.formContainer}>
      <form onSubmit={handleSubmit}>
        {Object.entries(formFields[type]).map(([name, field]) => (
          <Box className={classes.field} key={`form-field-${name}`}>
            <TextField
              {...(field.FieldProps || {})}
              fullWidth
              id={name}
              name={name}
              placeholder={formatLabel(field.placeholder)}
              label={formatLabel(name)}
              value={values[name]}
              onChange={handleChange}
              error={touched[name] && !!errors[name]}
              helperText={field.helper || (touched[name] && errors[name])}
            />
          </Box>
        ))}
        <Box className={classes.field}>
          <Button color="secondary" variant="contained" fullWidth type="submit">
            Continue
          </Button>
        </Box>
      </form>
    </Box>
  );
}
