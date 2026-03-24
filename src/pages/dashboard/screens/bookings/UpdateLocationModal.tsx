import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, Form, AutoComplete } from "antd";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { updateBookingLocation } from "@/api/bookingsApi";
import { useSWRConfig } from "swr";

interface UpdateLocationModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  onLocationUpdated?: () => void;
  initialData?: {
    pickup_address?: string;
    dropoff_address?: string;
    start_coord?: {
      latitude: number;
      longitude: number;
    };
    end_coord?: {
      latitude: number;
      longitude: number;
    };
  };
}

interface AutocompleteOption {
  value: string;
  label: React.ReactNode;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GMAPS_API_KEY || "";

const UpdateLocationModal: React.FC<UpdateLocationModalProps> = ({
  open,
  onClose,
  bookingId,
  onLocationUpdated,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [pickupSearch, setPickupSearch] = useState(initialData?.pickup_address || "");
  const [dropoffSearch, setDropoffSearch] = useState(initialData?.dropoff_address || "");
  const [pickupOptions, setPickupOptions] = useState<AutocompleteOption[]>([]);
  const [dropoffOptions, setDropoffOptions] = useState<AutocompleteOption[]>([]);
  const [loadingPickup, setLoadingPickup] = useState(false);
  const [loadingDropoff, setLoadingDropoff] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const pickupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropoffTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { mutate } = useSWRConfig();

  // Reset form when modal closes or opens with new data
  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        pickup_address: initialData.pickup_address,
        dropoff_address: initialData.dropoff_address,
      });
      setPickupSearch(initialData.pickup_address || "");
      setDropoffSearch(initialData.dropoff_address || "");
    }
  }, [open, initialData, form]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (pickupTimeoutRef.current) clearTimeout(pickupTimeoutRef.current);
      if (dropoffTimeoutRef.current) clearTimeout(dropoffTimeoutRef.current);
    };
  }, []);

  // Debounced autocomplete for pickup
  const handlePickupSearch = (value: string) => {
    setPickupSearch(value);
    form.setFieldsValue({ pickup_address: value });

    if (pickupTimeoutRef.current) clearTimeout(pickupTimeoutRef.current);

    pickupTimeoutRef.current = setTimeout(async () => {
      if (!value || value.length < 3) {
        setPickupOptions([]);
        return;
      }

      setLoadingPickup(true);

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

          setPickupOptions(options);
        } else {
          setPickupOptions([]);
        }
      } catch (error) {
        console.error("Pickup autocomplete error:", error);
        setPickupOptions([]);
      } finally {
        setLoadingPickup(false);
      }
    }, 500);
  };

  // Debounced autocomplete for dropoff
  const handleDropoffSearch = (value: string) => {
    setDropoffSearch(value);
    form.setFieldsValue({ dropoff_address: value });

    if (dropoffTimeoutRef.current) clearTimeout(dropoffTimeoutRef.current);

    dropoffTimeoutRef.current = setTimeout(async () => {
      if (!value || value.length < 3) {
        setDropoffOptions([]);
        return;
      }

      setLoadingDropoff(true);

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

          setDropoffOptions(options);
        } else {
          setDropoffOptions([]);
        }
      } catch (error) {
        console.error("Dropoff autocomplete error:", error);
        setDropoffOptions([]);
      } finally {
        setLoadingDropoff(false);
      }
    }, 500);
  };

  // Get coordinates from address
  const getCoordinatesFromAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch(
        `/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
    } catch (error) {
      console.error("Geocode error:", error);
    }
    return null;
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Updating location...");

    try {
      const payload: any = {
        booking_id: bookingId,
      };

      let hasChanges = false;

      // Ensure coordinates are always available by geocoding if missing from initialData
      // Start coord
      if (!initialData?.start_coord && values.pickup_address) {
        const startCoords = await getCoordinatesFromAddress(values.pickup_address);
        if (!startCoords) {
          toast.error("Could not fetch coordinates for pickup address", { id: loadingToast });
          setIsSubmitting(false);
          return;
        }
        payload.start_coord = {
          latitude: startCoords.lat,
          longitude: startCoords.lng,
        };
        hasChanges = true;
      } else if (initialData?.start_coord) {
        payload.start_coord = {
          latitude: initialData.start_coord.latitude,
          longitude: initialData.start_coord.longitude,
        };
      }

      // End coord  
      const effectiveDropoffAddress = values.dropoff_address || initialData?.dropoff_address;
      if (!initialData?.end_coord && effectiveDropoffAddress) {
        const endCoords = await getCoordinatesFromAddress(effectiveDropoffAddress);
        if (!endCoords) {
          toast.error("Could not fetch coordinates for dropoff address", { id: loadingToast });
          setIsSubmitting(false);
          return;
        }
        payload.end_coord = {
          latitude: endCoords.lat,
          longitude: endCoords.lng,
        };
        hasChanges = true;
      } else if (initialData?.end_coord) {
        payload.end_coord = {
          latitude: initialData.end_coord.latitude,
          longitude: initialData.end_coord.longitude,
        };
      }

      // Handle pickup address changes
      if (values.pickup_address && values.pickup_address !== initialData?.pickup_address) {
        payload.pickup_address = values.pickup_address;
        
        // Get coordinates for pickup
        const coords = await getCoordinatesFromAddress(values.pickup_address);
        if (coords) {
          payload.start_coord = {
            latitude: coords.lat,
            longitude: coords.lng,
          };
        } else {
          toast.error("Could not fetch coordinates for pickup address", { id: loadingToast });
          setIsSubmitting(false);
          return;
        }
        hasChanges = true;
      }

      // Handle dropoff address changes
      if (values.dropoff_address && values.dropoff_address !== initialData?.dropoff_address) {
        payload.dropoff_address = values.dropoff_address;
        
        // Get coordinates for dropoff
        const coords = await getCoordinatesFromAddress(values.dropoff_address);
        if (coords) {
          payload.end_coord = {
            latitude: coords.lat,
            longitude: coords.lng,
          };
        } else {
          toast.error("Could not fetch coordinates for dropoff address", { id: loadingToast });
          setIsSubmitting(false);
          return;
        }
        hasChanges = true;
      }

      // If no changes, show message and return
      if (!hasChanges) {
        toast.error("No changes detected", { id: loadingToast });
        setIsSubmitting(false);
        return;
      }

      console.log("Sending payload:", payload);

      const response = await updateBookingLocation(payload);

      if (response?.status === "ok") {
        toast.success("Location updated successfully!", { id: loadingToast });
        mutate(`/api/bookings/${bookingId}`);
        onLocationUpdated?.();
        onClose();
      } else {
        toast.error(response?.message || "Failed to update location", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.msg || error?.message || "Failed to update location", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={550}
      closeIcon={<FiX className="text-[#808D97]" />}
      destroyOnClose
    >
      <div className="bg-[#F3F5F9] px-4 py-6 mb-6">
        <h2 className="text-xl font-semibold text-[#000A0F]">
          Update Location
        </h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="px-6! pb-6!"
        initialValues={{
          pickup_address: initialData?.pickup_address,
          dropoff_address: initialData?.dropoff_address,
        }}
      >
        {/* Pickup Location */}
        <Form.Item
          label="Pickup Location"
          name="pickup_address"
          rules={[{ required: true, message: "Pickup location is required" }]}
        >
          <AutoComplete
            options={pickupOptions}
            onSearch={handlePickupSearch}
            onSelect={(value) => {
              setPickupSearch(value);
              form.setFieldsValue({ pickup_address: value });
            }}
            value={pickupSearch}
            filterOption={false}
            notFoundContent={loadingPickup ? "Searching..." : null}
          >
            <Input 
              size="large" 
              placeholder="Enter pickup location"
              className="rounded-lg!"
            />
          </AutoComplete>
        </Form.Item>

        {/* Destination Hospital */}
        <Form.Item
          label="Destination Hospital"
          name="dropoff_address"
          rules={[{ required: true, message: "Destination hospital is required" }]}
        >
          <AutoComplete
            options={dropoffOptions}
            onSearch={handleDropoffSearch}
            onSelect={(value) => {
              setDropoffSearch(value);
              form.setFieldsValue({ dropoff_address: value });
            }}
            value={dropoffSearch}
            filterOption={false}
            notFoundContent={loadingDropoff ? "Searching..." : null}
          >
            <Input 
              size="large" 
              placeholder="Enter destination hospital"
              className="rounded-lg!"
            />
          </AutoComplete>
        </Form.Item>

        {/* Buttons */}
        <div className="flex justify-between gap-4 pt-4">
          <Button
            size="large"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full bg-[#F5EAEA]! text-[#DB4A47]! font-medium! border-none!"
          >
            Cancel
          </Button>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="w-full bg-[#DB4A47]! hover:bg-[#c63d3a]! border-none!"
          >
            Update
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateLocationModal;