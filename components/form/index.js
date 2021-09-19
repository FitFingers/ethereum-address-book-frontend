import { useMemo } from "react";
import { makeStyles, Box, Button, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";
import useModal from "components/modal/context";
import useTransaction from "hooks/useTransaction";

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
  removeContactByName: yup.object({
    name: yup.string(msg.fill).required(msg.req),
  }),
  payContactByName: yup.object({
    name: yup.string(msg.fill).required(msg.req),
    sendValue: yup.string(msg.fill).matches(/^\d+$/).required(msg.req),
  }),
};

// Form field labels and init values
const formConfigs = {
  addContact: {
    name: {
      initial: "",
    },
    address: {
      initial: "",
      helper: "Please ensure this uses the correct network!",
    },
  },
  removeContactByName: {
    name: {
      initial: "",
      helper: "You can change this selection in the Contacts panel",
      FieldProps: {
        disabled: true,
      },
    },
  },
  payContactByName: {
    sendValue: {
      initial: "",
      helper: "The value to send in wei",
    },
    name: {
      initial: "",
      helper: "You can change this selection in the Contacts panel",
      FieldProps: {
        disabled: true,
      },
    },
    // gwei: {
    //   initial: "",
    // },
    // eth: {
    //   initial: "",
    // }
  },
};

function createInitialValues(contractFunction, formDefaults) {
  return Object.entries(formConfigs[contractFunction] || {}).reduce(
    (acc, [name, field]) => ({
      ...acc,
      [name]: field.initial || formDefaults[name],
    }),
    formDefaults
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

export default function Form() {
  const classes = useStyles();
  const { contractFunction, formDefaults = {}, callback } = useModal();
  const { prevHash, prevSuccess } = useTransaction();

  const { validationSchema, initialValues } = useMemo(
    () => ({
      validationSchema: validationSchemas[contractFunction],
      initialValues: createInitialValues(contractFunction, formDefaults),
    }),
    [formDefaults, contractFunction]
  );

  const { handleSubmit, values, handleChange, touched, errors } = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: callback,
  });

  return (
    <Box className={classes.formContainer}>
      <form onSubmit={handleSubmit}>
        {Object.entries(formConfigs[contractFunction] || {}).map(
          ([name, field]) => (
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
                helperText={(touched[name] && errors[name]) || field.helper}
              />
            </Box>
          )
        )}
        <Box className={classes.field}>
          <Button
            color="secondary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={prevHash && prevSuccess === null}
          >
            Continue
          </Button>
        </Box>
      </form>
    </Box>
  );
}
