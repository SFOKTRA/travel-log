<script setup lang="ts">
import { useForm } from "vee-validate";
import type { TypedSchema } from "vee-validate";
import type { z } from "zod";
import type { FetchError } from "ofetch";

// adapter to be added for handling validation errors and adapting vee-validate to zod (the version I installed does not support the zodTypedSchema yet)
function zodTypedSchema<T extends z.ZodType>(
  schema: T,
): TypedSchema<z.input<T>, z.output<T>> {
  return {
    __type: "VVTypedSchema",
    async parse(values) {
      const result = await schema.safeParseAsync(values);
      if (result.success)
        return {
          value: result.data,
          errors: [],
        };
      return {
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          errors: [issue.message],
        })),
      };
    },
  };
}

const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);

const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: zodTypedSchema(insertLocation),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    const _inserted = await $csrfFetch("/api/location", {
      method: "post",
      body: values,
    });
    submitted.value = true;
    navigateTo("/dashboard");
  } catch (e) {
    const error = e as FetchError;
    console.log(error.data?.data);
    if (error.data.data) {
      setErrors(error.data?.data);
    }

    submitError.value = error.statusMessage || "An an unknown error occurred";
  }
  loading.value = false;
});

// prompt the user to confirm leaving the page if there are any unsaved changes.
onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    const confirm = window.confirm(
      "Are you sure you want to leave? All unsaved changes will be lost!",
    );
    if (!confirm) {
      return false;
    }
  }
  return true;
});
</script>

<template>
  <div class="container max-w-md mx-auto mt-4">
    <div class="my-4">
      <h1 class="text-lg">Add Location</h1>
      <p class="text-sm">
        A location is a place you have travelled or will travel to. It can be a
        city, country, state or point of interest. You canadd specific times you
        visited this location after adding it.
      </p>
    </div>
    <div v-if="submitError" role="alert" class="alert alert-error">
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <FormField
        label="Name"
        name="name"
        :error="errors.name"
        :disabled="loading"
      />
      <FormField
        label="Description"
        name="description"
        :error="errors.description"
        :type="'textarea'"
        :disabled="loading"
      />
      <FormField
        label="Latitude"
        name="lat"
        :error="errors.lat"
        :type="'number'"
        :disabled="loading"
      />
      <FormField
        label="Longitude"
        name="long"
        :error="errors.long"
        :type="'number'"
        :disabled="loading"
      />
      <div class="flex justify-end gap-2">
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline"
          @click="router.back"
        >
          <Icon name="tabler:circle-arrow-left" size="20" />
          Cancel
        </button>
        <button :disabled="loading" type="submit" class="btn btn-primary">
          Submit
          <span v-if="loading" class="loading loading-spinner loading-xs" />
          <Icon v-else name="tabler:circle-plus-filled" size="20" />
        </button>
      </div>
    </form>
  </div>
</template>
