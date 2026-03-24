import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, Select, AutoComplete, Form } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { addHospital } from "@/api/hospitalsApi";
import { useSWRConfig } from "swr";

interface AddHospitalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  onHospitalAdded?: () => void;
}

interface AutocompleteOption {
  value: string;
  label: React.ReactNode;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GMAPS_API_KEY || "";

const AddHospitalModal: React.FC<AddHospitalModalProps> = ({
  open,
  onClose,
  onSubmit,
  onHospitalAdded,
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
    form.setFieldsValue({ address: value });

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
    form.setFieldsValue({ address: value });

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
    const loadingToast = toast.loading("Adding hospital...");

    const payload = {
      name: values.name,
      specialty: values.specialty,
      phone_number: values.phone_number,
      location: values.address,
      contact_person: values.contact_person,
      email: values.email,
      ...(values.location_coordinate && {
        location_coordinate: {
          latitude: values.location_coordinate.latitude,
          longitude: values.location_coordinate.longitude,
        },
      }),
    };

    try {
      const response = await addHospital(payload);

      toast.success("Hospital added successfully!", { id: loadingToast });
      globalMutate("/providers/hospitals/");

      form.resetFields();
      setAddressSearch("");
      setAutocompleteOptions([]);

      onHospitalAdded?.();
      onSubmit?.(response);
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add hospital", {
        id: loadingToast,
      });
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
      width={550}
      closeIcon={<FiX className="text-[#354959]" />}
      destroyOnClose
    >
      <div className="bg-[#F3F5F9] px-4 py-6 mb-6">
        <h2 className="text-xl font-semibold text-[#000A0F]">
          Add New Hospital
        </h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="px-6! pb-6!"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Hospital name is required" }]}
        >
          <Input size="large" placeholder="Enter hospital name" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Address is required" }]}
        >
          <AutoComplete
            options={autocompleteOptions}
            onSearch={handleAddressSearch}
            onSelect={handleAddressSelect}
            value={addressSearch}
            filterOption={false}
          >
            <Input size="large" placeholder="Enter hospital address" />
          </AutoComplete>
        </Form.Item>


        <Form.Item name="location_coordinate" hidden>
          <Input />
        </Form.Item>

       <div className="flex gap-4">
        <div className="flex-1">
            <Form.Item
            label="Specialty"
            name="specialty"
            rules={[{ required: true, message: "Specialty is required" }]}
            >
            <Select
                size="large"
                placeholder="Select specialty"
                options={[
                { value: "multi-specialty", label: "Multi-specialty" },
                { value: "cardiology", label: "Cardiology" },
                { value: "pediatrics", label: "Pediatrics" },
                { value: "neurology", label: "Neurology" },
                { value: "orthopedics", label: "Orthopedics" },
                { value: "oncology", label: "Oncology" },
                { value: "gynecology", label: "Gynecology" },
                ]}
            />
            </Form.Item>
        </div>

        <div className="flex-1">
            <Form.Item label="Geo-coordinates">
            <Input
                size="large"
                readOnly
                value={
                form.getFieldValue("location_coordinate")
                    ? `${form.getFieldValue("location_coordinate").latitude}, ${
                        form.getFieldValue("location_coordinate").longitude
                    }`
                    : ""
                }
                placeholder="Auto-filled from address"
            />
            </Form.Item>
        </div>
        </div>

        <Form.Item
          label="Contact Person Name"
          name="contact_person"
          rules={[{ required: true, message: "Contact person is required" }]}
        >
          <Input size="large" placeholder="Enter contact person name" />
        </Form.Item>

        <div className="flex gap-4">
            <div className="flex-1">
                <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Enter a valid email" },
                ]}
                >
                <Input size="large" type="email" placeholder="Enter email" />
                </Form.Item>
            </div>

            <div className="flex-1">
                <Form.Item
                label="Phone"
                name="phone_number"
                rules={[{ required: true, message: "Phone number is required" }]}
                >
                <Input size="large" placeholder="Enter phone number" />
                </Form.Item>
            </div>
         </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button 
           className="px-8! bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
           onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            htmlType="submit"
            type="primary"
            className="px-8! bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none!"
            loading={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddHospitalModal;