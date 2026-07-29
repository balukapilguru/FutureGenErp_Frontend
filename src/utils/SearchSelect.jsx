import React, { useState, useCallback, useEffect, useRef } from "react";
import Select from "react-select";
import { debounceSelect } from "./Utils";

export const SearchSelect = ({
    placeholder,
    fetchOptions,
    onChange,
    value,
    defaultOptions = [],
    isClearable = true,
    minSearchLength = 2 // Only hit API after 2 characters
}) => {
    const [options, setOptions] = useState(defaultOptions);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setOptions(defaultOptions);
    }, [defaultOptions]);
    // Label Cache: Stores the 'label' for an ID so it doesn't disappear 
    // when the search results change.
    const labelCache = useRef(new Map());

    useEffect(() => {
        // Sync cache with current options
        options?.forEach(opt => {
            if (opt.value) labelCache.current.set(String(opt.value), opt.label);
        });
    }, [options]);

    // Setup Debounced Search
    const loadData = useCallback(
        debounceSelect(async (inputValue) => {
            if (!inputValue || inputValue.length < minSearchLength) {
                setOptions(defaultOptions);
                return;
            }

            setIsLoading(true);
            try {
                const data = await fetchOptions(inputValue);
                setOptions(data);
            } catch (error) {
                console.error("SearchSelect Error:", error);
            } finally {
                setIsLoading(false);
            }
        }, 1000),
        [fetchOptions, defaultOptions, minSearchLength]
    );

    // Cleanup: Cancel the debounce timer if the component is destroyed
    useEffect(() => {
        return () => {
            if (loadData.cancel) loadData.cancel();
        };
    }, [loadData]);

    const handleInputChange = (newValue, { action }) => {
        if (action === "input-change") {
            loadData(newValue);
        }
    };

    // Logic to find the correct label to display
    const getSelectedValue = () => {
        if (!value) return null;

        // 1. Try current options
        const found = options.find(opt => String(opt.value) === String(value));
        if (found) return found;

        // 2. Try the cache (important when search list changes)
        if (labelCache.current.has(String(value))) {
            return {
                value: value,
                label: labelCache.current.get(String(value))
            };
        }
        console.log("Value not found in options or cache:", value);
        // 3. Fallback to just showing the value as label (temporary)
        return { label: value?.label, value:value?.value || value };
    };

    return (
        <Select
            classNamePrefix="Search"
            className="fs-s bg-form text_color input_bg_color"
            isLoading={isLoading}
            options={options || []}
            onInputChange={handleInputChange}
            onChange={(opt) => onChange(opt ? opt.value : "", opt)}
            value={getSelectedValue()}
            placeholder={placeholder}
            isClearable={isClearable}
            filterOption={() => true} // Tell react-select the API handled the filtering
        />
    );
};


export const MultiSearchSelect = ({
    placeholder,
    fetchOptions,
    onChange,
    value = [],
    defaultOptions = [],
    className = "" // Allow custom classes from parent
}) => {
    const [options, setOptions] = useState(defaultOptions);
    const [isLoading, setIsLoading] = useState(false);
    const labelCache = useRef(new Map());

    // Sync labels to prevent "ID-only" display
    useEffect(() => {
        const allSources = [...defaultOptions, ...options];
        allSources.forEach(opt => {
            if (opt?.value) labelCache.current.set(String(opt.value), opt.label);
        });
    }, [options, defaultOptions]);

    const loadData = useCallback(debounceSelect(async (search) => {
        if (!search) {
            setOptions(defaultOptions);
            return;
        }
        setIsLoading(true);
        try {
            const data = await fetchOptions(search);
            setOptions(data || []);
        } catch (err) {
            console.error("Search Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, 800), [fetchOptions, defaultOptions]);

    useEffect(() => () => loadData.cancel?.(), [loadData]);

    // const getSelectedValues = () => {
    //     // Ensure we are working with an array of values (IDs/Strings)
    //     const valuesArray = Array.isArray(value) ? value : [];

    //     return valuesArray?.map(val => {
    //         const strVal = String(val?.value || val); // Handle if passed objects or just IDs

    //         // 1. Search in current list
    //         const found = options.find(o => String(o.value) === strVal);
    //         if (found) return found;

    //         // 2. Search in label cache
    //         if (labelCache.current.has(strVal)) {
    //             return { value: val, label: labelCache.current.get(strVal) };
    //         }

    //         // 3. Fallback
    //         return { label: val?.label || `${strVal}`, value: strVal };
    //     });
    // };


    const getSelectedValues = () => {
        if (!Array.isArray(value)) return [];

        return value.map((val) => {
            // If already valid object, return as-is
            if (
                val &&
                typeof val === "object" &&
                val.label &&
                typeof val.value !== "object"
            ) {
                return val;
            }

            const id = String(val?.value ?? val);

            // 1. Check current options
            const found = options.find(
                (o) => String(o.value) === id
            );
            if (found) return found;

            // 2. Check cache
            if (labelCache.current.has(id)) {
                return {
                    value: id,
                    label: labelCache.current.get(id),
                };
            }

            // 3. Fallback
            return {
                value: id,
                label: id,
            };
        });
    };


    return (
        <Select
            isMulti
            classNamePrefix="Search"
            className={`fs-s bg-form text_color input_bg_color ${className}`}
            isLoading={isLoading}
            options={options}
            onInputChange={(val, { action }) => {
                if (action === "input-change") {
                    loadData(val);
                }
                // Returning val ensures the input text remains visible while typing
                return val;
            }}
            onChange={(selected) => {
                // Return full objects to match your handleCourseAdd logic
                onChange(selected || []);
            }}
            value={getSelectedValues()}
            placeholder={placeholder}
            filterOption={() => true} // API handles filtering
            isClearable
        />
    );
};

