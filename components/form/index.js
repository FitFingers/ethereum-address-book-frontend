import { makeStyles, Box, Button, TextField } from "@material-ui/core";
import * as yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";

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

// Form field labels and init values
const formFields = {
  addContact: {
    name: {
      initial: "",
    },
    address: {
      initial: "",
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
  return Object.entries(formFields[type]).map(([name, field]) => ({
    [name]: field.initial,
  }));
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
    onSubmit: (values) => {
      // TODO: add form use
      alert(JSON.stringify(values, null, 2));
    },
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
