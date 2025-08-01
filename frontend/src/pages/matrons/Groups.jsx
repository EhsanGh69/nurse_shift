import { useState, useEffect } from "react";
import { Grid, Typography, CircularProgress, Backdrop, Alert, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { GroupAdd } from '@mui/icons-material';

import { clickBox } from '../../styles/globalStyles';
import MainLayout from '../../mui/MainLayout';
import AppHeader from '../../components/AppHeader';
import { useMatronGroups } from '../../api/group.api';
import GroupBox from "../../components/GroupBox";

export default function Groups() {
	const [groups, setGroups] = useState([])
	const [loading, setLoading] = useState(false)
	const { isLoading, data } = useMatronGroups()

	useEffect(() => {
		if(!isLoading && data)
			setGroups(data)
		setLoading(isLoading)
	}, [isLoading, data])

	return (
		<MainLayout title="سرپرستار | گروه ها">
			<AppHeader />
			<Grid container width="100%">
				<Backdrop open={loading} sx={{ zIndex: (them) => them.zIndex.drawer + 1 }}>
					<CircularProgress color="inherit" />
				</Backdrop>
				<Button
					color="success"
					variant="contained"
					sx={{ mb: 2 }}
					LinkComponent={Link}
					size="large"
					to="/matron/groups/create"
				>
					<GroupAdd sx={{ mr: 1 }} />
					<Typography variant="h6">افزودن گروه جدید</Typography>
				</Button>

				{groups
					? groups.map(group => (
						<Grid
							display="flex"
							justifyContent="space-around"
							alignItems="center"
							size={{ xs: 12 }}
							key={group._id}
							sx={{ ...clickBox, flexDirection: { xs: "column", md: "row" }, mb: 2 }}
							component={Link}
							to={`/matron/groups/${group._id}`}
						>
							<GroupBox 
								county={group.county}  province={group.province}
								hospital={group.hospital} department={group.department}
							/>

						</Grid>
					))
					: (
						<Alert color="error" severity="error">
							<Typography variant="h3">گروهی وجود ندارد</Typography>
						</Alert>
					)
				}
			</Grid>
		</MainLayout>
	)
}
