import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, Form, AutoComplete } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { addProvider } from "@/api/providerApi";

interface AddProviderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  onProviderAdded?: () => void;
}

interface AutocompleteOption {
  value: string;
  label: React.ReactNode;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GMAPS_API_KEY || "";

const AddProviderModal: React.FC<AddProviderModalProps> = ({
  open,
  onClose,
  onSubmit,
  onProviderAdded,
}) => {
  const [form] = Form.useForm();
  const [addressSearch, setAddressSearch] = useState("");
  const [autocompleteOptions, setAutocompleteOptions] = useState<
    AutocompleteOption[]
  >([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autocompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { mutate: globalMutate } = useSWRConfig();

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setAddressSearch("");
      setAutocompleteOptions([]);
    }
  }, [open, form]);

  // Debounced autocomplete
  const handleAddressSearch = (value: string) => {
    setAddressSearch(value);
    form.setFieldsValue({ location: value });

    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current);
    }

    autocompleteTimeoutRef.current = setTimeout(async () => {
      if (!value || value.length < 3) {
        setAutocompleteOptions([]);
        return;
      }

      setLoadingAddress(true);

      try {
        const response = await fetch(
          `/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            value
          )}&key=${GOOGLE_MAPS_API_KEY}`
        );

        const data = await response.json();

        if (data.status === "OK") {
          const options = data.predictions.map((prediction: any) => ({
            value: prediction.description,
            label: (
              <div>
                <div className="font-medium">
                  {prediction.structured_formatting?.main_text}
                </div>
                <div className="text-xs text-gray-500">
                  {prediction.structured_formatting?.secondary_text}
                </div>
              </div>
            ),
          }));

          setAutocompleteOptions(options);
        } else {
          setAutocompleteOptions([]);
        }
      } catch (error) {
        console.error("Autocomplete error:", error);
        setAutocompleteOptions([]);
      } finally {
        setLoadingAddress(false);
      }
    }, 500);
  };

  // Fetch coordinates after selection
  const handleAddressSelect = async (value: string) => {
    setAddressSearch(value);
    form.setFieldsValue({ location: value });

    toast.loading("Getting coordinates...", { id: "geo" });

    try {
      const response = await fetch(
        `/maps/api/geocode/json?address=${encodeURIComponent(
          value
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;

        form.setFieldsValue({
          location_coordinate: {
            latitude: location.lat,
            longitude: location.lng,
          },
        });

        toast.success("Coordinates added!", { id: "geo" });
      } else {
        toast("Address saved without coordinates", { id: "geo" });
      }
    } catch (error) {
      console.error("Geocode error:", error);
      toast.error("Failed to fetch coordinates", { id: "geo" });
    }
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Adding provider...");

    const payload = {
      name: values.name,
      reg_number: values.reg_number,
      email: values.email,
      phone_number: values.phone_number,
      location: values.location,
      contact_person: values.contact_person,
      ...(values.location_coordinate && {
        location_coordinate: {
          latitude: values.location_coordinate.latitude,
          longitude: values.location_coordinate.longitude,
        },
      }),
    };

    try {
      const response = await addProvider(payload);
      
      if (response.status === 'ok') {
        toast.success('Provider added successfully', { id: loadingToast });
        globalMutate('/providers/all');
        
        form.resetFields();
        setAddressSearch("");
        setAutocompleteOptions([]);
        
        onProviderAdded?.();
        onSubmit?.(response);
        onClose();
      } else {
        const errorMsg = response?.response?.data?.msg || response?.message || 'Failed to add provider';
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error?.message || 'An error occurred while adding the provider', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (autocompleteTimeoutRef.current) {
        clearTimeout(autocompleteTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={650}
      closeIcon={<FiX className="text-[#808D97]" />}
      destroyOnClose
    >
      <div className="bg-[#F3F5F9] px-4 py-6">
        <h2 className="text-xl font-semibold text-[#000A0F]">
          Add New Provider
        </h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="px-6! py-6!"
      >
        {/* Name */}
        <Form.Item
          name="name"
          label={<span className="text-sm text-[#808D97]">Name</span>}
          rules={[{ required: true, message: "Provider name is required" }]}
        >
          <Input size="large" className="rounded-lg!" placeholder="Enter provider name" />
        </Form.Item>

        {/* Registration Number */}
        <Form.Item
          name="reg_number"
          label={<span className="text-sm text-[#808D97]">Registration Number</span>}
          rules={[{ required: true, message: "Registration number is required" }]}
        >
          <Input size="large" className="rounded-lg!" placeholder="Enter registration number" />
        </Form.Item>

        {/* Location with Autocomplete */}
        <Form.Item
          name="location"
          label={<span className="text-sm text-[#808D97]">Location</span>}
        >
          <AutoComplete
            options={autocompleteOptions}
            onSearch={handleAddressSearch}
            onSelect={handleAddressSelect}
            value={addressSearch}
            filterOption={false}
          >
            <Input size="large" className="rounded-lg!" placeholder="Enter location" />
          </AutoComplete>
        </Form.Item>

        {/* Hidden coordinate field */}
        <Form.Item name="location_coordinate" hidden>
          <Input />
        </Form.Item>

        {/* Contact Person Name */}
        <Form.Item
          name="contact_person"
          label={<span className="text-sm text-[#808D97]">Contact Person Name</span>}
        >
          <Input size="large" className="rounded-lg!" placeholder="Enter contact person name" />
        </Form.Item>

        {/* Email & Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label={<span className="text-sm text-[#808D97]">Email</span>}
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input size="large" className="rounded-lg!" type="email" placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label={<span className="text-sm text-[#808D97]">Phone</span>}
            rules={[{ required: true, message: "Phone number is required" }]}
          >
            <Input size="large" className="rounded-lg!" placeholder="Enter phone number" />
          </Form.Item>
        </div>

        {/* Optional: Show coordinates if available */}
        {form.getFieldValue("location_coordinate") && (
          <div className="mb-5 p-2 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">
              Coordinates: {form.getFieldValue("location_coordinate").latitude}, {form.getFieldValue("location_coordinate").longitude}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <Button
            size="large"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
          >
            Cancel
          </Button>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="px-6 bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none!"
          >
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddProviderModal;