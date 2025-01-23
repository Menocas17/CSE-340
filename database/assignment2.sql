-- Inserting the data to the account table 

INSERT INTO public.account WHERE PRIMARY KEY (account_id)(
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- Updating the account type for the user I just inserted 

UPDATE public.account 
SET account_type = 'Admin'
WHERE account_id = 1;

-- Deleting the Tony Stark user 

DELETE FROM public.account
WHERE account_id = 1;
-- Updating the description in the GM Hummer

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small', 'huge')
WHERE inv_id = 10;

-- Selecting the model and make information from the cars that belong to the sport classification


SELECT 
    public.inventory.inv_make,
    public.inventory.inv_model,
    public.classification.classification_id
FROM public.inventory
INNER JOIN public.classification
ON public.inventory.classification_id = public.classification.classification_id
WHERE public.classification.classification_name = 'Sport';

--Updating the path for the images and thumbnails

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/')
